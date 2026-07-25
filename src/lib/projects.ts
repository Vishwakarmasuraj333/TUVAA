import { fallbackProjects, type ProjectItem } from '@/data/projects'

export async function getAllProjects(): Promise<ProjectItem[]> {
  // Try database first if Prisma Project model exists
  try {
    const { prisma } = await import('@/lib/prisma')
    const dbProjects = await (prisma as any).project?.findMany?.({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    })

    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        image: p.image,
        excerpt: p.excerpt,
        content: p.content || '',
        isPublished: p.isPublished,
        order: p.order,
      }))
    }
  } catch (error) {
    // Prisma model may not exist yet — fall through to static data
  }

  return fallbackProjects
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const project = await (prisma as any).project?.findUnique?.({
      where: { slug },
    })

    if (project) {
      return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        image: project.image,
        excerpt: project.excerpt,
        content: project.content || '',
        isPublished: project.isPublished,
        order: project.order,
      }
    }
  } catch (error) {
    // Fall through to static data
  }

  return fallbackProjects.find((p) => p.slug === slug) || null
}
