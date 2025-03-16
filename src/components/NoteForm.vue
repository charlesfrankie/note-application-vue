import { ref } from "vue"

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Note } from '../types/note'
import { useNoteStore } from '../stores/notes'
import { useAuthStore } from '../stores/authentication'
import { useToast } from 'vue-toastification'

const noteStore = useNoteStore()
const toast = useToast()
const title = ref<string>('')
const content = ref<string | null>('')
const form_title = ref<string>('Add note')
const btn_text = ref<string>('Add note')
const is_edit = ref<boolean>(false)

watch(
  () => noteStore.selectedNote,
  (selectedNote) => {
    if (selectedNote) {
      title.value = selectedNote.title
      content.value = selectedNote.content
      form_title.value = 'Edit note'
      btn_text.value = 'Update'
      is_edit.value = true
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

const cancelEdit = () => {
  is_edit.value = false
  form_title.value = 'Add note'
  noteStore.editNote(null)
}

const handleSubmit = async () => {
  if (useAuthStore().isAuthenticated()) {
    const newNote: Note = {
      id: noteStore.selectedNote ? noteStore.selectedNote.id : null,
      title: title.value,
      content: content.value,
      created_at: null,
      updated_at: new Date().toISOString(),
      userId: noteStore.selectedNote ? noteStore.selectedNote.userId : null,
    }

    const response = is_edit.value
      ? await noteStore.updateNote(newNote)
      : await noteStore.addNote(newNote)
    resetForm()
    handleResponse(response)
  } else {
    toast.error('Please login to perform this action.')
  }
}

function resetForm() {
  is_edit.value = false
  form_title.value = 'Add note'
  btn_text.value = 'Add note'
  title.value = ''
  content.value = ''
}
const handleResponse = (response: any) => {
  if (response.success) {
    toast.success(response.message)
  } else {
    toast.error(response.message)
  }
}
</script>

<template>
  <div class="note-form p-4 pb-0 sm:pb-4">
    <div class="flex gap-2 items-center">
      <h2 class="text-xl xl:text-2xl font-semibold">{{ form_title }}</h2>
    </div>
    <hr class="mt-2 mb-4" />
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700"> Title </label>
        <input
          type="text"
          id="title"
          name="title"
          v-model="title"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm"
        />
      </div>
      <div class="mb-4">
        <label for="content" class="block text-sm font-medium text-gray-700"> Content </label>
        <textarea
          rows="5"
          id="content"
          name="content"
          v-model="content"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm"
        ></textarea>
      </div>
      <div class="mb-4 flex items-center gap-2">
        <button
          type="submit"
          class="block py-1 px-2 border bg-gray-900 text-white rounded-sm bg-green-600 md:hover:bg-green-700 md:hover:text-gray-300 text-sm transition-colors duration-200"
        >
          {{ btn_text }}
        </button>
        <button
          v-if="is_edit"
          type="button"
          @click="cancelEdit"
          class="block py-1 px-2 border bg-gray-900 text-white rounded-sm bg-yellow-500 md:hover:bg-yellow-600 md:hover:text-gray-300 text-sm transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
