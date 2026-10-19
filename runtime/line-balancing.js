/* Cognitive Learning Flow: deterministic line balancing domain engine. No UI, no dependencies. */
(function (root) {
  'use strict';
  const finitePositive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
  function solve(input) {
    if (!input || !finitePositive(input.availableSeconds) || !finitePositive(input.demand)) throw new Error('Disponibilidad y demanda deben ser positivas');
    if (!Array.isArray(input.tasks) || !input.tasks.length) throw new Error('Se requieren tareas');
    const cycle = input.availableSeconds / input.demand;
    const tasks = input.tasks.map((task, position) => {
      if (!task || typeof task.id !== 'string' || !task.id.trim() || !finitePositive(task.seconds)) throw new Error('Tarea inválida en posición ' + position);
      return {id: task.id, title: String(task.title || task.id), seconds: task.seconds, predecessors: [...(task.predecessors || [])]};
    });
    const ids = new Set(tasks.map(t=>t.id));
    if (ids.size !== tasks.length) throw new Error('IDs de tareas duplicados');
    for (const t of tasks) {
      if (!Array.isArray(t.predecessors) || t.predecessors.some(p => !ids.has(p) || p === t.id) || new Set(t.predecessors).size !== t.predecessors.length) throw new Error('Precedencia inválida en '+t.id);
      if (t.seconds > cycle + 1e-8) throw new Error('Tarea '+t.id+' supera el tiempo de ciclo');
    }
    // Validate acyclicity separately, with stable topological order.
    const resolved=new Set(), topo=[];
    while (topo.length<tasks.length){
      const next=tasks.find(t=>!resolved.has(t.id)&&t.predecessors.every(x=>resolved.has(x)));
      if(!next)throw new Error('Red de precedencias cíclica');
      resolved.add(next.id);topo.push(next.id);
    }
    // Priority is order of the supplied task list; scan through eligible tasks to fill every station.
    const assigned=new Set(), stations=[];
    while(assigned.size<tasks.length){
      const station={id:stations.length+1,tasks:[],load:0};
      let progress=true;
      while(progress){
        progress=false;
        for(const t of tasks){
          if(assigned.has(t.id) || !t.predecessors.every(p=>assigned.has(p)))continue;
          if(station.load+t.seconds<=cycle+1e-8){station.tasks.push(t.id);station.load+=t.seconds;assigned.add(t.id);progress=true;break;}
        }
      }
      if(!station.tasks.length)throw new Error('No es posible asignar tareas con el ciclo especificado');
      station.idle=Math.max(0,cycle-station.load);
      stations.push(station);
    }
    const total=tasks.reduce((sum,t)=>sum+t.seconds,0);
    const theoreticalMin=Math.ceil(total/cycle-1e-10);
    const efficiency=total/(stations.length*cycle);
    return {
      cycle,total,theoreticalMin,stations,efficiency,idleSeconds:stations.length*cycle-total,
      capacityPerShift:input.availableSeconds/cycle,
      taskCount:tasks.length,
      assignments: Object.fromEntries(stations.flatMap(s=>s.tasks.map(id=>[id,s.id]))),
      taskOrder:topo,
      heuristic:'precedence-aware first eligible fit; no claim of optimality'
    };
  }
  root.CLFLineBalancing=Object.freeze({solve});
})(globalThis);
