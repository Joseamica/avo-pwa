import AddTaskIcon from '@mui/icons-material/AddTask'
import BugReportIcon from '@mui/icons-material/BugReport'
import GitHubIcon from '@mui/icons-material/GitHub'
import HomeIcon from '@mui/icons-material/Home'
import TerrainIcon from '@mui/icons-material/Terrain'

import asyncComponentLoader from '@/utils/loader'

import { Pages, Routes } from './types'

const routes: Routes = {
  [Pages.Venues]: {
    component: asyncComponentLoader(() => import('@/pages/Venues/Venues')),
    path: '/venues',
    title: 'Page 4',
    icon: BugReportIcon,
    // children: [

    //   // HOW?!
    // ],
  },

  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
}

export default routes
