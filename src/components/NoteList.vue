<script setup lang="ts">
import NoteItem from './NoteItem.vue'
import { ref, onMounted, defineProps } from 'vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { useNoteStore } from '../stores/notes'

const noteStore = useNoteStore()
const isLoading = ref(true)
const notes = ref([])
const totalCount = ref(0)
const totalPages = ref(0)
const pageNumber = ref(1)
const pageSize = 10
const orderBy = ref('')

const fetchNotes = async (type: string | null = null) => {
  try {
    const response = await noteStore.getNotes(type, pageNumber.value, pageSize)
    if (response.success) {
      notes.value = response.data.notes
      totalCount.value = response.data.totalCount
      totalPages.value = response.data.totalPage
      isLoading.value = false
    }
  } catch (error) {
    console.error('Failed to fetch notes:', error)
  } finally {
    isLoading.value = false
  }
}

const handleFilter = (type: string) => {
  if (type === 'sort') {
    const selectElement = document.getElementById('sortBy') as HTMLSelectElement
    orderBy.value = selectElement.value

    if (selectElement.value === 'Sort by') {
      orderBy.value = 'created_at-desc'
    }
    fetchNotes(orderBy.value)
  }
}

const prevPage = () => {
  pageNumber.value--
  fetchNotes(orderBy.value)
}
const nextPage = () => {
  pageNumber.value++
  fetchNotes(orderBy.value)
}

onMounted(fetchNotes)
</script>

<template>
  <div class="note-list p-4">
    <div class="flex gap-2 items-center justify-between">
      <h2 class="text-xl xl:text-2xl font-semibold">Notes</h2>
      <div class="">
        <select
          @change="handleFilter('sort')"
          id="sortBy"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        >
          <option selected>Sort by</option>
          <option value="created_at-asc">Date: Ascending</option>
          <option value="created_at-desc">Date: Descending</option>
          <option value="title-asc">Title: A-Z</option>
          <option value="title-desc">Title: Z-A</option>
        </select>
      </div>
    </div>
    <hr class="mt-2 mb-4" />
    <div v-if="isLoading" class="text-center py-6">
      <PulseLoader />
    </div>
    <div v-else class="note-list">
      <NoteItem v-for="note in notes" :key="note.id" :note="note" />
    </div>
    <div class="flex items-center justify-center gap-2 my-5">
      <button
        class="bg-gray-900 disabled:bg-gray-600 text-white border px-3 py-1 rounded text-sm hover:bg-gray-600 transition-background duration-200"
        @click="prevPage"
        :disabled="pageNumber === 1"
      >
        Previous
      </button>
      <span>Page {{ pageNumber }} of {{ totalPages }}</span>
      <button
        class="bg-gray-900 disabled:bg-gray-600 text-white border px-3 py-1 rounded text-sm hover:bg-gray-600 transition-background duration-200"
        @click="nextPage"
        :disabled="pageNumber * pageSize >= totalCount"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped></style>
