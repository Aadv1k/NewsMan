import React from 'react';

interface DemoCardProps {
  method: string;
  data?: any;
  heading: string;
  url: string;
}

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function DemoCard({ method, data, heading, url }: DemoCardProps) {
  return (
    <div className="w-full rounded-lg px-2">
    <div className="flex gap-2 py-3">
          <span className="font-bold text-white rounded-sm px-1 uppercase bg-green-400">{method}</span>
          <p className="text-gray-600 font-mono">{url}</p>
      </div>

      <div className="overflow-scroll max-h-72">
          <SyntaxHighlighter language="json" style={docco}>
              {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default DemoCard;
