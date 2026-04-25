const fs = require('fs');

let code = fs.readFileSync('src/components/ChangelogModal.tsx', 'utf-8');

code = code.replace(/import \{ X, CheckCircle2, Sparkles, Monitor, ChevronRight, RotateCcw, Plus, Image as ImageIcon, Trash2, Maximize2, MessageSquare, ChevronDown, Check as CheckIcon, Layout, List, Square, Frame, ThumbsUp, Info, Github, Languages, Sun, StretchHorizontal, MousePointer2, Crop, CornerDownLeft \} from 'lucide-react';/,
`import { X, CheckCircle2, Sparkles, Monitor, ChevronRight, RotateCcw, Plus, Image as ImageIcon, Trash2, Maximize2, MessageSquare, ChevronDown, Check as CheckIcon, Layout, List, Square, Frame, ThumbsUp, Info, Github, Languages, Sun, StretchHorizontal, MousePointer2, Crop, CornerDownLeft, Shuffle } from 'lucide-react';`
);

fs.writeFileSync('src/components/ChangelogModal.tsx', code);
