'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export function GenerationForm() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Generate a New Portrait</CardTitle>
            <CardDescription>
              Upload a photo of your pet and choose a style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pet-photo">1. Upload a Photo</Label>
                <Input id="pet-photo" type="file" />
              </div>
              <div className="space-y-2">
                <Label>2. Choose a Style</Label>
                <p className="text-sm text-muted-foreground">Style options coming soon!</p>
              </div>
              <Button type="submit">
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generate Portrait
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Gallery</h2>
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">Your generated portraits will appear here.</p>
        </div>
      </section>
    </div>
  )
} 