<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useNoteStore } from '../../stores/notes'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import dayjs from 'dayjs'
import { useAuthStore } from '../../stores/authentication'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { debounce } from 'lodash'
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const noteStore = useNoteStore()
const isLoading = ref(true)
const notes = ref([])
const totalCount = ref(0)
const totalPages = ref(0)
const pageNumber = ref(1)
const pageSize = 10
const orderBy = ref('')
const filterBy = ref('')
const search = ref('')

const fetchNotes = async () => {
  const response = await noteStore.getNotes(
    orderBy.value,
    filterBy.value,
    search.value,
    pageNumber.value,
    pageSize,
  )
  if (response && response.success) {
    notes.value = response.data.notes
    totalCount.value = response.data.totalCount
    totalPages.value = response.data.totalPage
    isLoading.value = false
  }
}

const editNote = async (note) => {
  const authId = useAuthStore().auth_id
  if (authId && parseInt(note.userId) !== parseInt(authId)) {
    toast.error('Permission denied! You have no access to this note.')
  } else {
    router.push(`/admin/notes/edit/${note.id}`)
  }
}

const deleteNote = async (note) => {
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
        fetchNotes()
      } else {
        toast.error(response.message)
      }
    }
  }
}

const prevPage = () => {
  pageNumber.value--
  fetchNotes()
}
const nextPage = () => {
  pageNumber.value++
  fetchNotes()
}

const handleFilter = (type: string) => {
  if (type === 'sort') {
    const selectElement = document.getElementById('sortBy') as HTMLSelectElement
    orderBy.value = selectElement.value

    if (selectElement.value === 'Sort by') {
      orderBy.value = 'created_at-desc'
    }
  } else if (type === 'filter') {
    const selectElement = document.getElementById('filterBy') as HTMLSelectElement
    filterBy.value = selectElement.value

    if (selectElement.value !== 'my_post') {
      filterBy.value = ''
    }
  }
  fetchNotes()
}

const debounceFetchNotes = debounce(fetchNotes, 300)
// Watch for changes in the search input and debounce API calls
watch(search, () => {
  debounceFetchNotes()
})

onMounted(fetchNotes)
</script>

<template>
  <div class="relative overflow-x-auto w-full mt-0 p-3">
    <div v-if="isLoading" class="text-center py-6">
      <PulseLoader />
    </div>
    <div v-else>
      <div class="flex flex-col items-end lg:flex-row sm:items-center justify-between mb-4 gap-2">
        <div class="md:w-auto self-start flex gap-2 items-center">
          <p class="text-black text-lg">Note List</p>
          <RouterLink
            v-if="route.path.startsWith('/admin/notes')"
            :to="{ name: 'backend.add_note' }"
            class="bg-green-500 rounded p-2 border-green-500 text-white text-sm transition-color duration-200 hover:bg-green-700"
          >
            Add Note
          </RouterLink>
        </div>
        <div
          class="flex flex-col w-full sm:w-auto items-end sm:flex-row sm:items-center justify-end gap-2"
        >
          <input
            type="text"
            id="search"
            name="search"
            v-model="search"
            placeholder="Search..."
            class="w-full sm:w-64 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-sm"
          />
          <select
            @change="handleFilter('filter')"
            id="filterBy"
            class="w-full sm:w-40 bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-2"
          >
            <option selected>Filter</option>
            <option value="all">All</option>
            <option value="my_post">My post</option>
          </select>
          <select
            @change="handleFilter('sort')"
            id="sortBy"
            class="w-full sm:w-40 bg-white border border-gray-300 text-gray-900 text-sm rounded w-40 focus:ring-blue-500 focus:border-blue-500 block p-2"
          >
            <option selected>Sort by</option>
            <option value="created_at-asc">Date: Ascending</option>
            <option value="created_at-desc">Date: Descending</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
          </select>
        </div>
      </div>
      <table class="table-auto w-full text-sm text-left text-gray-500 border">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="p-2 sm:px-6 sm:py-3 w-12 min-w-[40px] text-center">No</th>
            <th scope="col" class="p-2 sm:px-6 sm:py-3 w-1/6">Title</th>
            <th scope="col" class="p-2 sm:px-6 sm:py-3 w-2/6">Content</th>
            <th scope="col" class="p-2 sm:px-6 sm:py-3 w-1/6">Date</th>
            <th scope="col" class="p-2 sm:px-6 sm:py-3 w-1/6">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(note, index) in notes"
            :key="note.id"
            class="bg-white border-b border-gray-200"
          >
            <th scope="row" class="md:p-3 w-12 min-w-[40px] text-center">
              {{ (pageNumber - 1) * pageSize + index + 1 }}
            </th>
            <td class="p-2 md:p-3 w-1/6">
              {{
                note.title
                  ? note.title.length > 20
                    ? note.title.slice(0, 20) + '...'
                    : note.title
                  : ''
              }}
            </td>
            <td class="p-2 md:p-3 w-1/6">
              {{
                note.content
                  ? note.content.length > 120
                    ? note.content.slice(0, 120) + '...'
                    : note.content
                  : ''
              }}
            </td>
            <td class="p-2 md:p-3">
              {{
                note.updated_at
                  ? dayjs(note.updated_at).format('YYYY-MM-DD HH:mm:ss')
                  : note.created_at
                    ? dayjs(note.created_at).format('YYYY-MM-DD HH:mm:ss')
                    : ''
              }}
            </td>
            <td class="p-2 md:p-3 gap-2 flex flex-col items-center sm:flex-row">
              <a
                @click="editNote(note)"
                class="w-fit bg-green-600 cursor-pointer text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition-background duration-200"
              >
                <img
                  src="../../assets/edit.svg"
                  alt="Edit"
                  class="w-4 md:w-5 h-4 md:h-5 text-white"
                />
              </a>
              <a
                @click="deleteNote(note)"
                class="w-fit bg-red-600 cursor-pointer text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition-background duration-200"
              >
                <img
                  src="../../assets/delete.svg"
                  alt="Edit"
                  class="w-4 md:w-5 h-4 md:h-5 text-white"
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
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
  </div>
</template>
