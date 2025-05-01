"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, HardDrive } from "lucide-react"

interface ConnectStorageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConnectStorageModal({ open, onOpenChange }: ConnectStorageModalProps) {
  const [activeTab, setActiveTab] = useState("local")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Storage</DialogTitle>
          <DialogDescription>Connect to a storage provider to access your files.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="local" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="local">Local Drive</TabsTrigger>
            <TabsTrigger value="google">Google Drive</TabsTrigger>
            <TabsTrigger value="dropbox">Dropbox</TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="space-y-4 py-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <HardDrive className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Local Storage</h3>
                <p className="mt-2 text-sm text-muted-foreground">Connect to a folder on your local drive.</p>
                <Button className="mt-4">Browse Folders</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="google" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <Cloud className="h-12 w-12 text-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-email">Google Account</Label>
                <Input id="google-email" placeholder="your.email@gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-api">API Key (Optional)</Label>
                <Input id="google-api" placeholder="Your Google Drive API key" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dropbox" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <Cloud className="h-12 w-12 text-blue-700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropbox-email">Dropbox Account</Label>
                <Input id="dropbox-email" placeholder="your.email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropbox-api">API Key (Optional)</Label>
                <Input id="dropbox-api" placeholder="Your Dropbox API key" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Connect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
