<script setup lang="ts">
import { defineProps } from 'vue'
import type { PropType } from 'vue'
import type { Note } from '../types/note'
import { useNoteStore } from '../stores/notes'
import { useAuthStore } from '../stores/authentication'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

defineProps({
  note: {
    type: Object as PropType<Note>,
    required: true,
  },
})

const noteStore = useNoteStore()
const toast = useToast()
const getNote = async (note: any) => {
  if (useAuthStore().isAuthenticated()) {
    const authId = useAuthStore().auth_id
    if (authId && parseInt(note.userId) !== parseInt(authId)) {
      toast.error('Permission denied! You have no access to this note.')
    } else {
      const response = await noteStore.getNoteById(note.id)
      if (response.success) {
        noteStore.editNote(response.note)
      }
    }
  } else {
    toast.error('Pleas login to perform this action.')
  }
}
const handleDeleteNote = async (note: any) => {
  if (useAuthStore().isAuthenticated()) {
    const authId = useAuthStore().auth_id
    if (authId && parseInt(note.userId) !== parseInt(authId)) {
      toast.error('Permission denied! You have no access to this note.')
    } else {
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color')
        .trim()

      const result = await Swal.fire({
        title: 'Delete Note',
        text: 'Are you sure you want to delete this note?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: primaryColor,
        cancelButtonText: 'Cancel',
        cancelButtonColor: 'red',
      })

      if (result.isConfirmed) {
        const response = await noteStore.deleteNote(note.id)
        if (response.success) {
          toast.success('Note has been deleted.')
          router.push({ name: 'backend.not' })
        } else {
          toast.error(response.message)
        }
      }
    }
  } else {
    toast.error('Pleas login to perform this action.')
  }
}
</script>

<template>
  <div class="note-item bg-gray-100 rounded p-2 sm:p-4 mb-3">
    <div class="note-title flex justify-between items-center mb-1 gap-2">
      <h3 class="text-black text-base sm:text-lg font-medium line-clamp-1 sm:line-clamp-2">
        <a href="#" class="underline hover:text-gray-600 transition-colors duration-200">
          {{ note.title }}
        </a>
      </h3>
      <span class="text-sm text-gray-500">
        {{
          note.updated_at
            ? new Date(note.updated_at).toISOString().split('T')[0]
            : note.created_at
              ? new Date(note.created_at).toISOString().split('T')[0]
              : ''
        }}
      </span>
    </div>
    <div class="note-content flex justify-between items-center gap-3">
      <p
        class="w-8/12 md:w-10/12 lg:w-11/12 text-gray-500 text-sm md:text-base line-clamp-2 md:line-clamp-3"
      >
        {{ note.content }}
      </p>
      <div class="action flex justify-between items-center gap-2">
        <button
          @click="getNote(note)"
          class="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition-background duration-200"
        >
          <img src="../assets/edit.svg" alt="Edit" class="w-4 md:w-5 h-4 md:h-5 text-white" />
        </button>
        <button
          @click="handleDeleteNote(note)"
          class="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition-background duration-200"
        >
          <img src="../assets/delete.svg" alt="Edit" class="w-4 md:w-5 h-4 md:h-5 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>
