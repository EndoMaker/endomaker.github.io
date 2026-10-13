(() => {
  const routes = {
    'planetary-drive': 'bldc-cycloidal-drive',
    'adaptive-gripper': 'dexterous-robot-hand',
    'dexterous-robot-hand': 'dexterous-robot-hand',
    'bldc-cycloidal-drive': 'bldc-cycloidal-drive',
    'delta-robot': 'delta-robot',
    'maker-cities-arches': 'maker-cities-arches',
    'automated-storage': 'automated-storage',
    'esp32-game-device': 'esp32-game-device'
  };
  const project = new URLSearchParams(location.search).get('project');
  if (Object.hasOwn(routes, project)) location.replace('projects/' + routes[project] + '.html');
})();