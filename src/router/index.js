import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddNote from '../views/AddNote.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Note from '../views/backend/Note.vue'
import NoteForm from '../views/backend/NoteForm.vue'
import BackendLayout from '../views/layouts/BackendLayout.vue'
import { useAuthStore } from '../stores/authentication'

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/notes/add',
      name: 'add-note',
      component: AddNote,
      beforeEnter: (to, from, next) => {
        if (useAuthStore().isAuthenticated()) {
          next()
        } else {
          next({ name: 'login' })
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/admin',
      name: 'admin',
      component: BackendLayout,
      children: [
        { path: 'notes', component: Note, name: 'backend.note' },
        { path: 'notes/add', component: NoteForm, name: 'backend.add_note' },
        { path: 'notes/edit/:id', component: NoteForm, name: 'backend.edit_note' },
      ],
      beforeEnter: (to, from, next) => {
        if (useAuthStore().isAuthenticated()) {
          next()
        } else {
          next({ name: 'login' })
        }
      },
    },
  ],
})

export default routes
