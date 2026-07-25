import PageBanner from '@/components/common/PageBanner'
import ProjectsIntroSection from '@/components/projects/ProjectsIntroSection'
import ProjectsGridSection from '@/components/projects/ProjectsGridSection'
import { getAllProjects } from '@/lib/projects'

export const metadata = {
  title: 'Our Projects - TUVAA',
  description:
    'Explore the key projects and community initiatives run by TUVAA: King Mzilikazi Commemoration, Mental Health, and Youth Mentorship.',
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="w-full bg-white">
      <PageBanner title="Our Projects" breadcrumb="Our Projects" />
      <ProjectsIntroSection />
      <ProjectsGridSection projects={projects} />
    </div>
  )
}
