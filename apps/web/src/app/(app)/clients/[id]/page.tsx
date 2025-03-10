import { VideoIcon } from '@radix-ui/react-icons'
import { Music2 } from 'lucide-react'
import { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Overview } from './tabs/overview'
import { Webhooks } from './tabs/webhooks'

interface ClientPageProps {
  params: { id: string }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Clinte',
  }
}

export default async function ClientPage({ params }: ClientPageProps) {
  const clientId = params.id

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="truncate text-3xl font-bold tracking-tight">
          Editar Cliente
        </h2>

        {/* <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a
              href={`/api/videos/${clientId}/download/video`}
              target="_blank"
              rel="noreferrer"
            >
              <VideoIcon className="mr-2 h-4 w-4" />
              <span>Download MP4</span>
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`/api/videos/${clientId}/download/audio`}
              target="_blank"
              rel="noreferrer"
            >
              <Music2 className="mr-2 h-4 w-4" />
              <span>Download MP3</span>
            </a>
          </Button>
        </div> */}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview videoId={clientId} />
        </TabsContent>
        <TabsContent value="webhooks">
          <Webhooks videoId={clientId} />
        </TabsContent>
      </Tabs>
    </>
  )
}
