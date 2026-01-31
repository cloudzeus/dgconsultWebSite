import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import * as dotenv from 'dotenv'
import { caseStudies } from '../src/lib/data'

dotenv.config()

async function main() {
    const url = process.env.DB_URL
    if (!url) {
        throw new Error('DB_URL is not defined in .env')
    }

    console.log('Seeding using .env DB_URL...')

    const connectionUrl = url.replace('mysql:', 'mariadb:')
    const adapter = new PrismaMariaDb(connectionUrl)
    const prisma = new PrismaClient({ adapter })

    console.log('Start seeding...')

    for (const study of caseStudies) {
        const techString = study.technologies ? study.technologies.join(', ') : null;

        console.log(`Upserting: ${study.slug}`)
        await prisma.caseStudy.upsert({
            where: { slug: study.slug },
            update: {
                title: study.title,
                description: study.description,
                content: study.content,
                category: study.category,
                featuredImage: study.image,
                clientName: study.clientName,
                industry: study.industry,
                technologies: techString,
                challenge: study.challenge,
                solution: study.solution,
                results: study.results,
                isPublished: true,
            },
            create: {
                slug: study.slug,
                title: study.title,
                description: study.description,
                content: study.content,
                category: study.category,
                featuredImage: study.image,
                clientName: study.clientName,
                industry: study.industry,
                technologies: techString,
                challenge: study.challenge,
                solution: study.solution,
                results: study.results,
                isPublished: true,
            },
        })
    }

    console.log('Seeding finished successfully.')
    await prisma.$disconnect()
}

main().catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
})
