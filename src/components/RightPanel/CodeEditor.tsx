'use client';

import React, { useRef } from 'react';
import { ProjectFile } from '../../types';
import { FileCode, Lock, Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  files: ProjectFile[];
  activeFileName: string;
  onSelectFile: (fileName: string) => void;
  onCodeChange: (fileName: string, newContent: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFileName,
  onSelectFile,
  onCodeChange,
}) => {
  const [copied, setCopied] = React.useState(false);
  const activeFile = files.find(f => f.name === activeFileName) || files[0];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lineCount = (activeFile?.content.split('\n') || []).length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[#000000] select-text">
      {/* Tab Bar */}
      <div className="flex items-center justify-between bg-[#050505] border-b border-white/[0.08] px-3 py-1.5 select-none shrink-0">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {files.map((file) => {
            const isActive = file.name === activeFileName;

            return (
              <button
                key={file.name}
                onClick={() => onSelectFile(file.name)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span>{file.name}</span>
                {file.readOnly && (
                  <span className="flex items-center text-[10px] text-neutral-400" title="Read-only test/reference file">
                    <Lock className="w-2.5 h-2.5 ml-1" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Copy & Status Action */}
        <div className="flex items-center space-x-2 px-1">
          {activeFile.readOnly && (
            <span className="text-[11px] font-medium text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded">
              Read-Only
            </span>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            title="Copy file contents"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 flex overflow-hidden relative text-xs leading-5">
        {/* Line Numbers Column */}
        <div className="w-12 py-3 bg-[#000000] text-neutral-600 font-mono text-right pr-3 select-none border-r border-white/[0.06] overflow-hidden shrink-0">
          {lineNumbers.map((num) => (
            <div key={num} className="h-5">
              {num}
            </div>
          ))}
        </div>

        {/* Text Area Code Editor */}
        <div className="flex-1 relative overflow-auto">
          <textarea
            ref={textareaRef}
            value={activeFile.content}
            onChange={(e) => onCodeChange(activeFile.name, e.target.value)}
            readOnly={activeFile.readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="w-full h-full p-3 bg-[#050505] text-[#f4f4f5] font-mono-code text-xs leading-5 resize-none outline-none focus:outline-none whitespace-pre tab-4"
            style={{
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Editor Status Footer */}
      <div className="h-7 bg-[#000000] border-t border-white/[0.08] px-3.5 flex items-center justify-between text-[11px] text-neutral-400 select-none shrink-0 font-medium">
        <div className="flex items-center space-x-3">
          <span>{activeFile.language.toUpperCase()}</span>
          <span className="text-neutral-600">·</span>
          <span>UTF-8</span>
          <span className="text-neutral-600">·</span>
          <span>{lineCount} lines</span>
        </div>
        <div>
          <span>Tab Size: 2</span>
        </div>
      </div>
    </div>
  );
};
