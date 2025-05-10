"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText, Image as ImageIcon } from "lucide-react";

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "未选择文件",
        description: "请先选择一个文件再上传。",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    // Mock upload process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUploading(false);
    
    toast({
      title: "上传成功 (模拟)",
      description: `文件 "${selectedFile.name}" 已成功上传。`,
    });
    setSelectedFile(null); 
    // Reset file input if possible - this is tricky with controlled file inputs
    const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (fileInput) {
        fileInput.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="reportFile" className="sr-only">选择报告文件</Label>
        <Input
          id="reportFile"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
      </div>
      {selectedFile && (
        <div className="p-3 border rounded-md bg-muted/50">
          <div className="flex items-center space-x-2 text-sm">
            {selectedFile.type.startsWith("image/") ? <ImageIcon className="h-5 w-5 text-muted-foreground" /> : <FileText className="h-5 w-5 text-muted-foreground" />}
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-xs text-muted-foreground">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
          </div>
        </div>
      )}
      <Button type="submit" disabled={!selectedFile || isUploading} className="w-full">
        <UploadCloud className="mr-2 h-4 w-4" />
        {isUploading ? "上传中..." : "上传文件"}
      </Button>
    </form>
  );
}
