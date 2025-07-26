const API_URL = '/api/tasks';

const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const filterStatus = document.getElementById('filterStatus');
const filterPriority = document.getElementById('filterPriority');
const taskIdInput = document.getElementById('taskId');
const statsEl = document.getElementById('stats');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const taskFormContainer = document.getElementById('taskFormContainer');

let tasks = [];

// Cargar filtros guardados
filterStatus.value = localStorage.getItem('filterStatus') || 'Todas';
filterPriority.value = localStorage.getItem('filterPriority') || 'Todas';

// Mostrar/ocultar formulario
toggleFormBtn.addEventListener('click', () => {
  taskFormContainer.classList.toggle('hidden');
});

// Leer (GET)
async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
    updateStats();
  } catch (err) {
    console.error('Error al traer tareas:', err);
    Swal.fire('Error', 'No se pudieron cargar las tareas.', 'error');
  }
}

// Renderizar lista
function renderTasks() {
  const statusFilter = filterStatus.value;
  const priorityFilter = filterPriority.value;

  let filtered = tasks;
  if (statusFilter !== 'Todas') filtered = filtered.filter(t => t.status === statusFilter);
  if (priorityFilter !== 'Todas') filtered = filtered.filter(t => t.priority === priorityFilter);

  tasksList.innerHTML = '';

  if (filtered.length === 0) {
    tasksList.innerHTML = '<p class="text-center text-gray-500">No hay tareas para mostrar</p>';
    return;
  }

  filtered.forEach(task => {
    // Calcular urgencia
    const dueDateText = task.due_date ? task.due_date.substring(0,10) : 'Sin fecha';
    const today = new Date();
    const dueDateObj = new Date(task.due_date);
    const diffDays = (dueDateObj - today) / (1000 * 60 * 60 * 24);
    let dateClass = 'text-gray-500';
    if (!isNaN(diffDays) && diffDays <= 2 && diffDays >= 0) dateClass = 'text-red-500';

    // Recortar descripción larga
    const shortDescription = (task.description && task.description.length > 120)
      ? task.description.substring(0, 120) + '...'
      : task.description || '';

    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded shadow flex justify-between items-center';

    div.innerHTML = `
      <div class="w-full overflow-hidden">
        <h3 class="font-semibold break-words">${task.title}</h3>
        <p class="text-sm text-gray-600 break-words whitespace-normal">${shortDescription}</p>
        <p class="text-xs ${dateClass} flex items-center gap-1 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14"/>
          </svg>
          ${dueDateText}
        </p>
        <div class="mt-1 space-x-2">
          <span class="text-xs px-2 py-1 rounded ${badgeColor(task.priority)}">${task.priority}</span>
          <span class="text-xs px-2 py-1 rounded ${statusColor(task.status)}">${task.status}</span>
        </div>
      </div>
      <div class="space-x-2 flex">
        <button onclick="editTask(${task.id})" class="text-blue-500 hover:text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6.536-6.536a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z"/>
          </svg>
        </button>
        <button onclick="deleteTask(${task.id})" class="text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7L5 7M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2m1 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7m5 4v6m4-6v6"/>
          </svg>
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

  // Validaciones frontend
  if (task.title.length === 0) {
    return Swal.fire('Atención', 'El título es obligatorio.', 'warning');
  }
  if (task.title.length > 150) {
    return Swal.fire('Atención', 'El título no puede tener más de 150 caracteres.', 'warning');
  }
  if (task.description.length > 1000) {
    return Swal.fire('Atención', 'La descripción no puede tener más de 1000 caracteres.', 'warning');
  }

  try {
    let res;
    const id = taskIdInput.value;
    if (id) {
      res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task)
      });
    }

    if (!res.ok) {
      const error = await res.json();
      Swal.fire('Error', error.error || 'Error al guardar tarea', 'error');
    } else {
      taskForm.reset();
      taskIdInput.value = '';
      taskFormContainer.classList.add('hidden'); // ocultar después de guardar
      await fetchTasks();
      Swal.fire('Éxito', 'Tarea guardada correctamente.', 'success');
    }
  } catch (err) {
    console.error('Error al guardar tarea:', err);
    Swal.fire('Error', 'No se pudo guardar la tarea.', 'error');
  }
});

// Eliminar
async function deleteTask(id) {
  const confirm = await Swal.fire({
    title: '¿Seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  if (confirm.isConfirmed) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      await fetchTasks();
      Swal.fire('Eliminado', 'Tarea eliminada correctamente.', 'success');
    } catch (err) {
      console.error('Error al eliminar:', err);
      Swal.fire('Error', 'No se pudo eliminar la tarea.', 'error');
    }
  }
}

// Editar
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  document.getElementById('title').value = task.title;
  document.getElementById('description').value = task.description || '';
  document.getElementById('dueDate').value = task.due_date ? task.due_date.substring(0,10) : '';
  document.getElementById('priority').value = task.priority;
  document.getElementById('status').value = task.status;
  taskIdInput.value = task.id;
  taskFormContainer.classList.remove('hidden'); // mostrar el formulario
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

// Estadísticas
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

// Filtros (guardar estado)
filterStatus.addEventListener('change', () => {
  localStorage.setItem('filterStatus', filterStatus.value);
  renderTasks();
});
filterPriority.addEventListener('change', () => {
  localStorage.setItem('filterPriority', filterPriority.value);
  renderTasks();
});

// Inicial
fetchTasks();

// Esperar a que cargue el DOM para que exista el botón
document.addEventListener('DOMContentLoaded', () => {
  const toggleFormBtn = document.getElementById('toggleFormBtn');
  const taskFormContainer = document.getElementById('taskFormContainer');

  toggleFormBtn.addEventListener('click', () => {
    taskFormContainer.classList.toggle('hidden');
  });
});

