<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { useNoteStore } from '../../stores/notes'
import { useAuthStore } from '../../stores/authentication'
import type { Note } from '../../types/note'

const route = useRoute()
const router = useRouter()
const noteStore = useNoteStore()
const id = Number(route.params.id)
const title = ref<string>()
const content = ref<string>()
const isEdit = ref<Boolean>(false)
const isLoading = ref(false)
const note = ref<Note>({})

const fetchNote = async () => {
  if (id) {
    isLoading.value = true
    const response = await noteStore.getNoteById(id)

    if (response.success) {
      note.value = response.note
      title.value = response.note.title
      content.value = response.note.content
      isEdit.value = true
      isLoading.value = false
    }
  }
}

const handleCancel = () => {
  router.push({ name: 'backend.note' })
  title.value = ''
  content.value = ''
  isEdit.value = false
}

const submitForm = async () => {
  if (useAuthStore().isAuthenticated()) {
    const newNote: Note = {
      id: note.value ? note.value.id : null,
      title: title.value,
      content: content.value,
      created_at: null,
      updated_at: new Date().toISOString(),
    }

    const response = isEdit.value
      ? await noteStore.updateNote(newNote)
      : await noteStore.addNote(newNote)

    if (response.success) {
      router.push({ name: 'backend.note' })
    }
    resetForm()
  }
}

function resetForm() {
  note.value = null
  title.value = ''
  content.value = ''
  isEdit.value = false
  isLoading.value = false
}
onMounted(fetchNote)
</script>
<template>
  <div class="relative overflow-x-auto mt-5 w-full">
    <div v-if="isLoading" class="text-center py-6">
      <PulseLoader />
    </div>

    <form class="w-9/12 mx-auto" @submit.prevent="submitForm">
      <div class="mb-5">
        <label for="title" class="block mb-2 text-sm font-medium text-gray-900">Title</label>
        <input
          type="text"
          id="title"
          v-model="title"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="name@flowbite.com"
          required
        />
      </div>
      <div class="mb-5">
        <label for="content" class="block mb-2 text-sm font-medium text-gray-900">Content</label>
        <textarea
          rows="5"
          id="content"
          name="content"
          v-model="content"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-gray-400 focus:border-gray-400 sm:text-sm"
        ></textarea>
      </div>
      <button
        type="submit"
        class="text-white bg-green-500 transition-color duration-200 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Save change
      </button>
      <button
        @click="handleCancel"
        type="button"
        class="text-white ml-4 bg-yellow-500 transition-color duration-200 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Cancel
      </button>
    </form>
  </div>
</template>
