const API_URL = '/api/tasks';

const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const filterStatus = document.getElementById('filterStatus');
const filterPriority = document.getElementById('filterPriority');
const taskIdInput = document.getElementById('taskId');

const statsEl = document.getElementById('stats');

let tasks = []; // todas las tareas

// Leer (GET)
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
    updateStats();
  } catch (err) {
    console.error('Error al traer tareas:', err);
  }
}

// Renderizar lista
function renderTasks() {
  const statusFilter = filterStatus.value;
  const priorityFilter = filterPriority.value;

  let filtered = tasks;
  if (statusFilter !== 'Todas') {
    filtered = filtered.filter(t => t.status === statusFilter);
  }
  if (priorityFilter !== 'Todas') {
    filtered = filtered.filter(t => t.priority === priorityFilter);
  }

  tasksList.innerHTML = '';

  if (filtered.length === 0) {
    tasksList.innerHTML = '<p class="text-center text-gray-500">No hay tareas para mostrar</p>';
    return;
  }

  filtered.forEach(task => {
    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded shadow flex justify-between items-center';

    div.innerHTML = `
      <div>
        <h3 class="font-semibold">${task.title}</h3>
        <p class="text-sm text-gray-600 truncate">${task.description || ''}</p>
        <p class="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14"/></svg>
          ${task.due_date ? task.due_date.substring(0,10) : 'Sin fecha'}
        </p>
        <div class="mt-1 space-x-2">
          <span class="text-xs px-2 py-1 rounded ${badgeColor(task.priority)}">${task.priority}</span>
          <span class="text-xs px-2 py-1 rounded ${statusColor(task.status)}">${task.status}</span>
        </div>
      </div>
      <div class="space-x-2 flex">
        <button onclick="editTask(${task.id})" class="text-blue-500 hover:text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6.536-6.536a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z"/></svg>
        </button>
        <button onclick="deleteTask(${task.id})" class="text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7L5 7M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2m1 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7m5 4v6m4-6v6"/></svg>
        </button>
      </div>
    `;
    tasksList.appendChild(div);
  });
}

// Crear & Update
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const task = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    due_date: document.getElementById('dueDate').value,
    priority: document.getElementById('priority').value,
    status: document.getElementById('status').value
  };

  if (task.title.length === 0) {
  alert('El título es obligatorio.');
  return;
  }
  if (task.title.length > 150) {
  alert('El título no puede tener más de 150 caracteres.');
  return;
  }


  try {
    const id = taskIdInput.value;
    if (id) {
      // Update
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
      });
    } else {
      // Create
      await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
      });
    }
    taskForm.reset();
    taskIdInput.value = '';
    await fetchTasks();
  } catch (err) {
    console.error('Error al guardar tarea:', err);
  }
});

// Eliminar
async function deleteTask(id) {
  if (!confirm('¿Seguro de eliminar esta tarea?')) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await fetchTasks();
  } catch (err) {
    console.error('Error al eliminar:', err);
  }
}

// Editar (llenar formulario)
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  document.getElementById('title').value = task.title;
  document.getElementById('description').value = task.description || '';
  document.getElementById('dueDate').value = task.due_date ? task.due_date.substring(0,10) : '';
  document.getElementById('priority').value = task.priority;
  document.getElementById('status').value = task.status;
  taskIdInput.value = task.id;
}

// Badges
function badgeColor(priority) {
  switch(priority) {
    case 'Alta': return 'bg-red-100 text-red-800';
    case 'Media': return 'bg-yellow-100 text-yellow-800';
    case 'Baja': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-300';
  }
}
function statusColor(status) {
  switch(status) {
    case 'Pendiente': return 'bg-blue-100 text-blue-800';
    case 'En progreso': return 'bg-yellow-100 text-yellow-800';
    case 'Completada': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-300';
  }
}

// Actualizar estadísticas
function updateStats() {
  const pendientes = tasks.filter(t => t.status === 'Pendiente').length;
  const enProgreso = tasks.filter(t => t.status === 'En progreso').length;
  const completadas = tasks.filter(t => t.status === 'Completada').length;

  statsEl.innerHTML = `
    <h2 class="font-semibold mb-2">Estadísticas</h2>
    <div class="flex gap-4">
      <p class="text-blue-600">${pendientes} Pendientes</p>
      <p class="text-yellow-600">${enProgreso} En Progreso</p>
      <p class="text-green-600">${completadas} Completadas</p>
    </div>
  `;
}

// Filtros
filterStatus.addEventListener('change', renderTasks);
filterPriority.addEventListener('change', renderTasks);

// Inicial
fetchTasks();
