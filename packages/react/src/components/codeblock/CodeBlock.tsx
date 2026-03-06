import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/cn.js';

export type CodeBlockTheme = 'dark' | 'light' | 'auto';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightedHtml?: string;
  showLineNumbers?: boolean;
  theme?: CodeBlockTheme;
  className?: string;
}

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 4V2.5A1.5 1.5 0 0 0 8.5 1h-6A1.5 1.5 0 0 0 1 2.5v6A1.5 1.5 0 0 0 2.5 10H4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
  highlightedHtml,
  showLineNumbers = false,
  theme = 'auto',
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const lines = code.split('\n');

  return (
    <div
      className={cn('tokis-codeblock', className)}
      data-codeblock-theme={theme !== 'auto' ? theme : undefined}
    >
      <div className="tokis-codeblock__header">
        <span className="tokis-codeblock__lang">
          {filename ?? language ?? 'code'}
        </span>
        <button
          type="button"
          className={cn('tokis-codeblock__copy', copied && 'tokis-codeblock__copy--copied')}
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="tokis-codeblock__body">
        {showLineNumbers && (
          <div className="tokis-codeblock__lines" aria-hidden="true">
            {lines.map((_, i) => (
              <span key={i} className="tokis-codeblock__line-num">{i + 1}</span>
            ))}
          </div>
        )}
        <pre className="tokis-codeblock__pre">
          {highlightedHtml ? (
            <code
              className={cn('tokis-codeblock__code', language && `language-${language}`)}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <code className={cn('tokis-codeblock__code', language && `language-${language}`)}>
              {code}
            </code>
          )}
        </pre>
      </div>
    </div>
  );
};

CodeBlock.displayName = 'CodeBlock';
