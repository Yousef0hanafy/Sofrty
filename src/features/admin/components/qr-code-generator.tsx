'use client'

import React from 'react'
import { Download, QrCode, ExternalLink, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/store/app-store'

export function QrCodeGenerator() {
  const { language } = useAppStore()
  const isRTL = language === 'ar'

  const menuUrl = typeof window !== 'undefined' ? window.location.origin : 'https://madaq.app'
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}&color=1a1a2e&bgcolor=ffffff`
  const qrDownloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}&color=1a1a2e&bgcolor=ffffff&format=png&download=1`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          {isRTL ? 'رمز QR' : 'QR Code'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isRTL
            ? 'أنشئ رمز QR لقائمة المطعم الرقمية'
            : 'Generate QR code for the digital menu'}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-sm flex items-center justify-center gap-2">
              <QrCode className="h-4 w-4" />
              {isRTL ? 'رمز QR للقائمة الرقمية' : 'Digital Menu QR Code'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Image */}
            <div className="flex justify-center">
              <div className="rounded-xl border-2 border-dashed border-primary/20 p-4 bg-white">
                <img
                  src={qrApiUrl}
                  alt="QR Code"
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* URL Display */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {isRTL ? 'الرابط المُشفّر' : 'Encoded URL'}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={menuUrl}
                  readOnly
                  dir="ltr"
                  className="text-center font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(menuUrl)
                  }}
                  title={isRTL ? 'نسخ الرابط' : 'Copy URL'}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <a href={qrDownloadUrl} download="madaq-qr.png" className="inline-block">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  {isRTL ? 'تحميل PNG' : 'Download PNG'}
                </Button>
              </a>
            </div>

            {/* Instructions */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Smartphone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">
                    {isRTL ? 'كيفية الاستخدام' : 'How to Use'}
                  </p>
                  <p>
                    {isRTL
                      ? 'اطبع رمز QR وضعه على الطاولة ليتمكن الزبائن من تصفح القائمة مباشرة من هواتفهم.'
                      : 'Print this QR code and place it on tables so customers can browse the menu directly from their phones.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
