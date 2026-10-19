/* CLF 0.6 — independent, deterministic operations models (no eval, no DOM). */
(function(root){
  'use strict';
  const finite=(v)=>typeof v==='number' && Number.isFinite(v);
  const check=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const positive=(v,name)=>check(finite(v)&&v>0,name+' debe ser positivo y finito');
  const bounded=(v,min,max,name)=>check(finite(v)&&v>=min&&v<=max,name+' fuera de rango');
  function inventory(p){
    const {annualDemand:D,orderCost:S,holdingCost:H,orderQuantity:Q,workingDays:days}=p;
    for(const [n,v] of Object.entries({annualDemand:D,orderCost:S,holdingCost:H,orderQuantity:Q,workingDays:days}))positive(v,n);
    check(days<=366,'workingDays no puede superar 366');
    const eoq=Math.sqrt(2*D*S/H),ordering=D/Q*S,holding=Q/2*H;
    const period=Q/(D/days);
    const series=Array.from({length:61},(_,i)=>{
      const t=2*period*i/60;
      const residual=Q-(D/days)*(t%period);
      return {t,stock:Math.max(0,residual)};
    });
    return {kind:'inventory-eoq',metrics:{eoq,annualRelevantCost:ordering+holding,orderingCost:ordering,holdingCost:holding,ordersPerYear:D/Q,cycleDays:period},series,unit:'unidades',insight:Q<eoq?'Lotes menores al EOQ elevan principalmente los costos de pedido.':Q>eoq?'Lotes mayores al EOQ elevan principalmente los costos de mantenimiento.':'Estás en el lote económico aproximado.'};
  }
  function rng(seed){
    let x=seed>>>0;
    return ()=>{x+=0x6D2B79F5;let z=x;z=Math.imul(z^(z>>>15),z|1);z^=z+Math.imul(z^(z>>>7),z|61);return ((z^(z>>>14))>>>0)/4294967296;};
  }
  function queue(p){
    const {arrivalRate:lambda,serviceRate:mu,customers=24,seed=17}=p;
    positive(lambda,'arrivalRate');positive(mu,'serviceRate');
    check(Number.isInteger(customers)&&customers>=1&&customers<=160,'customers fuera de rango');
    check(Number.isInteger(seed)&&seed>=0&&seed<=4294967295,'seed inválida');
    const stable=mu>lambda;
    const rand=rng(seed),events=[];
    let arrival=0,lastFinish=0,waitSum=0;
    for(let i=0;i<customers;i++){
      arrival+=-Math.log(Math.max(1e-12,1-rand()))/lambda;
      const duration=-Math.log(Math.max(1e-12,1-rand()))/mu;
      const start=Math.max(arrival,lastFinish),finish=start+duration;
      events.push({id:i+1,arrival,start,finish,wait:start-arrival,duration});
      waitSum+=start-arrival;lastFinish=finish;
    }
    const rho=lambda/mu;
    return {kind:'queue-mm1',stable,metrics:{utilization:rho,expectedQueueWait:stable?lambda/(mu*(mu-lambda)):null,expectedQueueSize:stable?(lambda*lambda)/(mu*(mu-lambda)):null,observedQueueWait:waitSum/customers,sampledCustomers:customers},events,unit:'tiempo',insight:stable?'Modelo M/M/1 estable: resultados teóricos de largo plazo frente a una muestra simulada.':'No existe estado estacionario estable con λ ≥ μ. El gráfico es solo una muestra finita.'};
  }
  function production(p){
    const {arrivalInterval,stationCycles,units=12}=p;
    positive(arrivalInterval,'arrivalInterval');
    check(Array.isArray(stationCycles)&&stationCycles.length>=2&&stationCycles.length<=8,'stationCycles requiere 2–8 estaciones');
    stationCycles.forEach((v,i)=>positive(v,'estación '+(i+1)));
    check(Number.isInteger(units)&&units>=1&&units<=80,'units fuera de rango');
    const jobs=[];const last=new Array(stationCycles.length).fill(0);
    for(let j=0;j<units;j++){
      const stations=[];let prior=j*arrivalInterval;
      for(let k=0;k<stationCycles.length;k++){
        const start=Math.max(prior,last[k]),end=start+stationCycles[k];
        stations.push({station:k+1,start,end});last[k]=end;prior=end;
      }
      jobs.push({id:j+1,arrival:j*arrivalInterval,stations,finished:prior});
    }
    const bottleneck=Math.max(...stationCycles);
    const makespan=jobs.at(-1).finished;
    return {kind:'production-line',metrics:{bottleneckMinutes:bottleneck,bottleneckStation:stationCycles.indexOf(bottleneck)+1,theoreticalCapacityPerHour:60/bottleneck,inputPacedCapacityPerHour:60/Math.max(arrivalInterval,bottleneck),sampleThroughputPerHour:60*units/makespan,makespan,units},jobs,unit:'minutos',insight:'La capacidad límite es 60 / máximo tiempo de estación; el rendimiento de una muestra corta incluye arranque y vaciado.'};
  }
  function solve(spec,overrides={}){
    check(spec&&typeof spec==='object'&&spec.parameters&&typeof spec.parameters==='object','Escenario inválido');
    const p={...spec.parameters};
    for(const [key,value] of Object.entries(overrides)){
      check(Object.hasOwn(p,key),'Parámetro desconocido: '+key);
      if(key==='stationCycles')check(Array.isArray(value),'stationCycles debe ser arreglo');
      p[key]=value;
    }
    if(spec.kind==='inventory-eoq')return inventory(p);
    if(spec.kind==='queue-mm1')return queue(p);
    if(spec.kind==='production-line')return production(p);
    throw new Error('Tipo de simulación no soportado: '+spec.kind);
  }
  function sensitivity(spec,parameter,min,max,count=21,overrides={}){
    check(spec&&spec.parameters&&Object.hasOwn(spec.parameters,parameter),'Parámetro inexistente');
    check(parameter!=='stationCycles','La sensibilidad de stationCycles requiere un adaptador específico');
    bounded(min,0,1e8,'min');bounded(max,0,1e8,'max');check(max>min,'Rango vacío');
    check(Number.isInteger(count)&&count>=3&&count<=81,'Puntos fuera de rango');
    const metrics={'inventory-eoq':['annualRelevantCost','Costo relevante anual'],'queue-mm1':['expectedQueueWait','Espera teórica Wq'],'production-line':['inputPacedCapacityPerHour','Capacidad teórica, u/h']};
    const choice=metrics[spec.kind];check(!!choice,'Sin métrica para esta simulación');
    const result=[];
    for(let i=0;i<count;i++){
      const x=min+(max-min)*i/(count-1);
      try {const m=solve(spec,{...overrides,[parameter]:x}).metrics;result.push({x,y:m[choice[0]]});}
      catch(err){result.push({x,y:null});}
    }
    return {parameter,metric:choice[0],label:choice[1],points:result};
  }
  function validateScenario(spec){
    check(spec&&typeof spec.id==='string'&&/^[a-z0-9][a-z0-9-]*$/.test(spec.id),'ID de escenario inválido');
    check(typeof spec.title==='string'&&spec.title.trim(),'Título inválido');
    check(['inventory-eoq','queue-mm1','production-line'].includes(spec.kind),'Modelo desconocido');
    const result=solve(spec);
    if(spec.controls!==undefined){
      check(Array.isArray(spec.controls),'controls debe ser arreglo');
      const ids=new Set();
      for(const c of spec.controls){
        check(c&&typeof c.key==='string'&&Object.hasOwn(spec.parameters,c.key),'Control sin parámetro válido');
        check(!ids.has(c.key),'Control duplicado');ids.add(c.key);
        check(typeof c.label==='string'&&c.label.trim(),'Etiqueta de control inválida');
        check(finite(c.min)&&finite(c.max)&&finite(c.step)&&c.max>c.min&&c.step>0,'Límites de control inválidos');
        check(finite(spec.parameters[c.key])&&spec.parameters[c.key]>=c.min&&spec.parameters[c.key]<=c.max,'Valor inicial fuera de límites');
      }
    }
    if(spec.sensitivity){
      const s=spec.sensitivity;
      check(typeof s.parameter==='string'&&Object.hasOwn(spec.parameters,s.parameter),'Sensibilidad sin parámetro');
      sensitivity(spec,s.parameter,s.min,s.max,11);
    }
    return result;
  }
  root.CLFSim=Object.freeze({solve,sensitivity,validateScenario,version:'0.6.0'});
})(globalThis);
