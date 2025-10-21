const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const calendarGrid = document.getElementById('calendar-grid');
const selectedDateEl = document.getElementById('selected-date');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const todayBtn = document.getElementById('today-btn');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const prioritySelect = document.getElementById('priority-select');
const categorySelect = document.getElementById('category-select');
const timeInput = document.getElementById('time-input');
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const statsEl = document.getElementById('stats');
const notificationBtn = document.getElementById('notification-btn');
const inlineNotification = document.getElementById('inline-notification');
const notificationText = document.querySelector('.notification-text');
const notificationClose = document.querySelector('.notification-close');
const progressFill = document.getElementById('progress-fill');
const shareBtn = document.getElementById('share-btn');
const shareModal = document.getElementById('share-modal');
const modalClose = document.getElementById('modal-close');
const copyLink = document.getElementById('copy-link');
const shareWhatsapp = document.getElementById('share-whatsapp');
const shareEmail = document.getElementById('share-email');
const shareTwitter = document.getElementById('share-twitter');
const syncBtn = document.getElementById('sync-btn');
const syncModal = document.getElementById('sync-modal');
const syncClose = document.getElementById('sync-close');
const googleSignin = document.getElementById('google-signin');
const anonymousSignin = document.getElementById('anonymous-signin');
const syncNow = document.getElementById('sync-now');
const signOut = document.getElementById('sign-out');
const syncStatus = document.getElementById('sync-status');
const syncInfo = document.getElementById('sync-info');
const userEmail = document.getElementById('user-email');

let currentUser = null;
let isOnline = navigator.onLine;

// Simple Firebase check
setTimeout(() => {
    if (window.auth) {
        console.log('Firebase loaded successfully');
    }
}, 1000);

function updateSyncUI() {
    if (currentUser) {
        syncBtn.classList.add('synced');
        syncBtn.title = 'Synced with Cloud';
        syncStatus.style.display = 'none';
        syncInfo.style.display = 'block';
        userEmail.textContent = currentUser.email || 'Anonymous User';
    } else {
        syncBtn.classList.remove('synced');
        syncBtn.title = 'Sync with Cloud';
        syncStatus.style.display = 'block';
        syncInfo.style.display = 'none';
    }
}

function syncToCloud() {
    showInlineNotification('☁️ Sync feature coming soon!');
}

function syncFromCloud() {
    showInlineNotification('☁️ Sync feature coming soon!');
}


// Update notification button state
function updateNotificationBtn() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            notificationBtn.classList.add('enabled');
            notificationBtn.title = 'Notifications Enabled';
        } else {
            notificationBtn.classList.remove('enabled');
            notificationBtn.title = 'Click to Enable Notifications';
        }
    }
}

function showNotification(title, body) {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">✅</text></svg>'
        });
    }
    
    // Inline notification
    showInlineNotification(`${title}: ${body}`);
}

function playNotificationSound() {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function showInlineNotification(message) {
    notificationText.textContent = message;
    inlineNotification.classList.add('show');
    
    // Play notification sound
    playNotificationSound();
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        inlineNotification.classList.remove('show');
    }, 5000);
}

function checkTimeNotifications() {
    if (Notification.permission !== 'granted') return;
    
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const dateStr = formatDate(now);
    const todayTodos = todos[dateStr] || [];
    
    todayTodos.forEach(todo => {
        if (todo.time === currentTime && !todo.completed && !todo.notified) {
            showNotification('⏰ Todo Reminder', `${todo.text}`);
            todo.notified = true;
            saveTodos();
        }
    });
}

// Check notifications every 10 seconds for testing (change to 60000 for production)
setInterval(() => {
    checkTimeNotifications();
    // Debug: log current time and todos with times
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const dateStr = formatDate(now);
    const todayTodos = todos[dateStr] || [];
    const todosWithTime = todayTodos.filter(t => t.time);
    if (todosWithTime.length > 0) {
        console.log('Current time:', currentTime, 'Todos with time:', todosWithTime.map(t => `${t.text} at ${t.time}`));
    }
}, 10000);

let currentFilter = 'all';
let searchTerm = '';

// Initialize dates properly
const today = new Date();
let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const todos = JSON.parse(localStorage.getItem('modernTodos') || '{}');

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function saveTodos() {
    localStorage.setItem('modernTodos', JSON.stringify(todos));
}

function getTodosForDate(date) {
    const dateStr = formatDate(date);
    return todos[dateStr] || [];
}

function populateSelectors() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    monthSelect.innerHTML = '';
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    
    yearSelect.innerHTML = '';
    for (let year = 2020; year <= 2099; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthSelect.value = month;
    yearSelect.value = year;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    calendarGrid.innerHTML = '';
    
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.textContent = day;
        dayEl.style.fontWeight = '600';
        dayEl.style.color = 'rgba(255, 255, 255, 0.8)';
        dayEl.style.fontSize = '0.8rem';
        calendarGrid.appendChild(dayEl);
    });
    
    for (let i = 0; i < firstDay; i++) {
        calendarGrid.appendChild(document.createElement('div'));
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        const dayDate = new Date(year, month, day);
        const dayTodos = getTodosForDate(dayDate);
        
        if (dayTodos.length > 0) {
            dayEl.classList.add('has-todos');
        }
        
        if (dayDate.toDateString() === today.toDateString()) {
            dayEl.classList.add('today');
        }
        
        if (dayDate.toDateString() === selectedDate.toDateString()) {
            dayEl.classList.add('selected');
        }
        
        dayEl.addEventListener('click', () => {
            selectedDate = new Date(year, month, day);
            renderCalendar();
            renderTodos();
        });
        
        calendarGrid.appendChild(dayEl);
    }
}

function renderTodos() {
    const dateStr = formatDate(selectedDate);
    const dateTodos = todos[dateStr] || [];
    
    selectedDateEl.textContent = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    
    const completed = dateTodos.filter(t => t.completed).length;
    const total = dateTodos.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    statsEl.textContent = `${completed}/${total} completed (${percentage}%)`;
    
    // Update progress bar
    progressFill.style.width = `${percentage}%`;
    progressFill.classList.toggle('complete', percentage === 100 && total > 0);
    
    list.innerHTML = '';
    
    const sortedTodos = dateTodos.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (a.completed !== b.completed) return a.completed - b.completed;
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    sortedTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `priority-${todo.priority}`;
        
        const shouldShow = filterTodo(todo);
        if (!shouldShow) li.classList.add('hidden');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            li.classList.toggle('completed', todo.completed);
            renderTodos();
            saveTodos();
        });
        
        const metaDiv = document.createElement('div');
        metaDiv.className = 'todo-meta';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        if (todo.completed) {
            textSpan.classList.add('completed');
            li.classList.add('completed');
        }
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'todo-info';
        
        const categoryTag = document.createElement('span');
        categoryTag.className = 'category-tag';
        const categoryEmojis = { work: '💼', personal: '👤', health: '🏃', shopping: '🛍', other: '📝' };
        categoryTag.textContent = `${categoryEmojis[todo.category]} ${todo.category}`;
        
        infoDiv.appendChild(categoryTag);
        
        if (todo.time) {
            const timeSpan = document.createElement('span');
            timeSpan.className = 'todo-time';
            timeSpan.textContent = todo.time;
            infoDiv.appendChild(timeSpan);
        }
        
        metaDiv.appendChild(textSpan);
        metaDiv.appendChild(infoDiv);
        
        textSpan.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todo.text;
            input.className = 'edit-input';
            
            const saveEdit = () => {
                if (input.value.trim()) {
                    todo.text = input.value.trim();
                    saveTodos();
                    renderTodos();
                }
                textSpan.textContent = todo.text;
                textSpan.style.display = 'block';
                input.remove();
            };
            
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') {
                    textSpan.style.display = 'block';
                    input.remove();
                }
            });
            
            textSpan.style.display = 'none';
            textSpan.parentNode.insertBefore(input, textSpan);
            input.focus();
            input.select();
        });
        
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '×';
        delBtn.addEventListener('click', () => {
            li.classList.add('deleting');
            setTimeout(() => {
                const todoIndex = dateTodos.findIndex(t => t.id === todo.id);
                dateTodos.splice(todoIndex, 1);
                if (dateTodos.length === 0) {
                    delete todos[dateStr];
                }
                renderTodos();
                renderCalendar();
                saveTodos();
            }, 500);
        });
        
        li.appendChild(checkbox);
        li.appendChild(metaDiv);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
    
    emptyState.classList.toggle('hidden', dateTodos.length > 0);
}

function filterTodo(todo) {
    const matchesSearch = !searchTerm || todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = currentFilter === 'all' || 
                         (currentFilter === 'completed' && todo.completed) ||
                         (currentFilter === 'pending' && !todo.completed);
    return matchesSearch && matchesFilter;
}

function addTodo() {
    const text = input.value.trim();
    if (!text) {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 500);
        return;
    }
    
    const dateStr = formatDate(selectedDate);
    if (!todos[dateStr]) {
        todos[dateStr] = [];
    }
    
    const todo = {
        text,
        completed: false,
        priority: prioritySelect.value,
        category: categorySelect.value,
        time: timeInput.value,
        id: Date.now()
    };
    
    todos[dateStr].push(todo);
    input.value = '';
    timeInput.value = '';
    renderTodos();
    
    const newTodo = list.lastElementChild;
    if (newTodo) {
        newTodo.classList.add('adding');
        setTimeout(() => newTodo.classList.remove('adding'), 600);
    }
    
    renderCalendar();
    saveTodos();
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

monthSelect.addEventListener('change', () => {
    currentDate.setMonth(parseInt(monthSelect.value));
    renderCalendar();
});

yearSelect.addEventListener('change', () => {
    currentDate.setFullYear(parseInt(yearSelect.value));
    renderCalendar();
});

todayBtn.addEventListener('click', () => {
    const today = new Date();
    currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    renderCalendar();
    renderTodos();
});

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Notification button
notificationBtn.addEventListener('click', async () => {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            updateNotificationBtn();
            if (permission === 'granted') {
                showNotification('✅ Notifications Enabled', 'You\'ll get reminders for your scheduled todos!');
            }
        } else if (Notification.permission === 'denied') {
            alert('Notifications are blocked. Please enable them in your browser settings.');
        } else if (Notification.permission === 'granted') {
            showNotification('🔔 Test Notification', 'Notifications are working!');
        }
    }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderTodos();
});

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});



// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        addTodo();
    }
    if (e.key === 'Escape') {
        input.blur();
        searchInput.blur();
    }
});

// Load theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
}

// Notification close button
notificationClose.addEventListener('click', () => {
    inlineNotification.classList.remove('show');
});

// Share functionality
shareBtn.addEventListener('click', () => {
    shareModal.classList.add('show');
});

modalClose.addEventListener('click', () => {
    shareModal.classList.remove('show');
});

shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        shareModal.classList.remove('show');
    }
});

copyLink.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        showInlineNotification('Link copied to clipboard!');
        shareModal.classList.remove('show');
    } catch (err) {
        showInlineNotification('Failed to copy link');
    }
});

shareWhatsapp.addEventListener('click', () => {
    const text = 'Check out this awesome Modern Todo App! 🚀';
    const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
    window.open(url, '_blank');
    shareModal.classList.remove('show');
});

shareEmail.addEventListener('click', () => {
    const subject = 'Check out this Modern Todo App!';
    const body = `Hi! I found this amazing todo app that helps me stay organized. You should try it: ${window.location.href}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    shareModal.classList.remove('show');
});

shareTwitter.addEventListener('click', () => {
    const text = 'Just discovered this amazing Modern Todo App! 🚀 Perfect for staying organized ✅';
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    shareModal.classList.remove('show');
});

// Sync functionality
syncBtn.addEventListener('click', () => {
    syncModal.classList.add('show');
});

syncClose.addEventListener('click', () => {
    syncModal.classList.remove('show');
});

syncModal.addEventListener('click', (e) => {
    if (e.target === syncModal) {
        syncModal.classList.remove('show');
    }
});

googleSignin.addEventListener('click', () => {
    showInlineNotification('🔑 Google sign-in coming soon!');
    syncModal.classList.remove('show');
});

anonymousSignin.addEventListener('click', () => {
    showInlineNotification('👤 Anonymous sign-in coming soon!');
    syncModal.classList.remove('show');
});

syncNow.addEventListener('click', () => {
    syncToCloud();
});

signOut.addEventListener('click', () => {
    showInlineNotification('🚪 Sign out coming soon!');
    syncModal.classList.remove('show');
});

// Auto-sync when todos change
function saveTodos() {
    localStorage.setItem('modernTodos', JSON.stringify(todos));
    if (currentUser && isOnline) {
        syncToCloud();
    }
}

// Online/offline detection
window.addEventListener('online', () => {
    isOnline = true;
    if (currentUser) {
        syncFromCloud();
    }
});

window.addEventListener('offline', () => {
    isOnline = false;
});

// Initialize notification button
updateNotificationBtn();

// Ensure dates are properly set on load
const todayDate = new Date();
selectedDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
currentDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

populateSelectors();
renderCalendar();
renderTodos();