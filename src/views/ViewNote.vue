<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useNoteStore } from '../stores/notes'
import { useAuthStore } from '../stores/authentication'

const router = useRouter()
const route = useRoute()
const id = ref(Number(route.params.id) ?? null)
const noteStore = useNoteStore()
const note = ref({})

const fetchNote = async () => {
  if (useAuthStore().isAuthenticated()) {
    if (id) {
      const response = await noteStore.getNoteById(id.value)
      if (response.success) {
        note.value = response.note
      }
    }
  } else {
    router.push({ name: 'home' })
  }
}

onMounted(fetchNote)
</script>

<template>
  <div class="p-4 my-3">
    <div>
      <h1 class="text-xl sm:text-2xl font-semibold mb-3">{{ note.title }}</h1>
      <p class="text-gray-500 text-sm mb-1">
        Create at:
        {{ note.created_at ? new Date(note.created_at).toLocaleString().replace('T', '') : '' }}
      </p>
      <p v-if="note.updated_at" class="text-gray-500 text-sm">
        Update at:
        {{ note.updated_at ? new Date(note.updated_at).toLocaleString().replace('T', '') : '' }}
      </p>
    </div>
    <hr class="my-4" />
    <p>
      {{ note.content }}
    </p>
  </div>
</template>
