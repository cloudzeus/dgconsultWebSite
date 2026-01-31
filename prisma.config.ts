import { defineConfig } from '@prisma/config'

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: process.env.DB_URL || "mysql://user:pass@localhost:3306/db",
    },
})
