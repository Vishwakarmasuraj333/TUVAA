'use client'

import ProjectCard from './ProjectCard'
import type { ProjectItem } from '@/data/projects'

interface ProjectsGridSectionProps {
  projects: ProjectItem[]
}

export default function ProjectsGridSection({ projects }: ProjectsGridSectionProps) {
  return (
    <section className="w-full bg-[#FAFAFA] px-4 sm:px-6 pt-[60px] pb-[100px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              excerpt={project.excerpt}
              image={project.image}
              slug={project.slug}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
