import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronRight, FileText, ImageIcon, Smile, Settings, Search, MoreHorizontal, ChevronDown, BookOpen, Folder, FolderOpen, Bold, Italic, Heading1, Heading2, List, ListOrdered, Edit2, Trash2, Copy, Palette, Type, PenTool, Eraser, X, Download, Code } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type ProjectFolder = {
  id: string;
  name: string;
  isOpen: boolean;
};

type Note = {
  id: string;
  folderId: string | null;
  icon: string;
  title: string;
  content: string; // HTML content
  doodleData?: string; // Base64 image data
  coverUrl?: string;
};

const DEFAULT_FOLDERS: ProjectFolder[] = [
  { id: 'f1', name: 'Interview Prep', isOpen: true },
  { id: 'f2', name: 'DSA Journey', isOpen: true },
];

const DEFAULT_NOTES: Note[] = [
  {
    id: '1',
    folderId: 'f1',
    icon: '🚀',
    title: 'System Design Interview Prep',
    content: '<h1>System Design Basics</h1><p>1. Requirements Gathering</p><p>2. System Interface Definition</p><p>3. Back-of-the-envelope Estimation</p><p><br></p><h2>Key Concepts to review:</h2><ul><li>Consistent Hashing</li><li>CAP Theorem</li><li>Rate Limiting Strategies</li></ul>',
  },
  {
    id: '2',
    folderId: 'f2',
    icon: '💻',
    title: 'Algorithms Cheat Sheet',
    content: '<h1>Sorting Algorithms</h1><h2>Quick Sort</h2><p>Time Complexity: O(n log n)<br>Space Complexity: O(log n)</p><br><h2>Merge Sort</h2><p>Time Complexity: O(n log n)<br>Space Complexity: O(n)</p><pre><code>function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}</code></pre>',
  },
  {
    id: '3',
    folderId: 'f1',
    icon: '📝',
    title: 'Behavioral Stories (STAR)',
    content: '<p><b>Situation:</b> The servers went down during the black friday sale.</p><p><b>Task:</b> I needed to coordinate the incident response and restore the database.</p><p><b>Action:</b> I led the war room, partitioned the read replicas, and managed traffic routing.</p><p><b>Result:</b> We restored service in 14 minutes and prevented $2M in lost revenue.</p>',
  },
  {
    id: '4',
    folderId: null,
    icon: '📌',
    title: 'Quick Scratchpad',
    content: '<p>Empty scratchpad...</p>',
  }
];

// --- Doodle Canvas Component ---
const DoodleCanvas = ({ initialData, onSave, onClose }: { initialData?: string; onSave: (d: string) => void; onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#18181b');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Canvas setup
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width * 2;
      canvas.height = 500 * 2;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = '500px';
      ctx.scale(2, 2);
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
      };
      img.src = initialData;
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? 20 : lineWidth;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onSave(canvas.toDataURL());
  };

  return (
    <div className="w-full border border-black/[0.08] rounded-2xl overflow-hidden bg-white shadow-sm my-8 flex flex-col">
      <div className="h-12 border-b border-black/[0.06] bg-[#FAFAFA] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-lg">
            <button onClick={() => setIsEraser(false)} className={`p-1.5 rounded-md transition-colors ${!isEraser ? 'bg-white shadow-sm' : 'hover:bg-black/[0.04]'}`}><PenTool className="w-4 h-4 text-zinc-700" /></button>
            <button onClick={() => setIsEraser(true)} className={`p-1.5 rounded-md transition-colors ${isEraser ? 'bg-white shadow-sm' : 'hover:bg-black/[0.04]'}`}><Eraser className="w-4 h-4 text-zinc-700" /></button>
          </div>
          
          {!isEraser && (
            <>
              <div className="w-px h-4 bg-zinc-300" />
              <div className="flex items-center gap-2">
                {['#18181b', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map(c => (
                  <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'border-zinc-400 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="w-px h-4 bg-zinc-300" />
              <div className="flex items-center gap-1">
                {/* Extended thickness options */}
                {[2, 4, 8, 12, 16].map(w => (
                  <button key={w} onClick={() => setLineWidth(w)} className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${lineWidth === w ? 'bg-zinc-200' : 'hover:bg-zinc-100'}`} title={`${w}px brush`}>
                    <div className="bg-zinc-800 rounded-full" style={{ width: Math.min(w + 2, 20), height: Math.min(w + 2, 20) }} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearCanvas} className="text-xs font-medium px-3 py-1.5 rounded-md hover:bg-zinc-200 text-zinc-600 transition-colors">Clear</button>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-zinc-200 text-zinc-600 transition-colors"><X className="w-4 h-4" /></button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full cursor-crosshair touch-none"
      />
    </div>
  );
};


// --- Main Notes Vault ---
export const NotesVault: React.FC = () => {
  const { user } = useAuthStore();
  const workspaceName = user?.name ? `${user.name}'s Workspace` : 'Candidate Workspace';
  const workspaceInitial = user?.name ? user.name.slice(0, 1).toUpperCase() : 'K';

  const [folders, setFolders] = useState<ProjectFolder[]>(DEFAULT_FOLDERS);
  const [notes, setNotes] = useState<Note[]>(DEFAULT_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string>(DEFAULT_NOTES[0].id);
  const [showSketchpad, setShowSketchpad] = useState(false);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, id: string, type: 'folder' | 'note' } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  useEffect(() => {
    const hideMenu = () => setContextMenu(null);
    window.addEventListener('click', hideMenu);
    return () => window.removeEventListener('click', hideMenu);
  }, []);

  const updateActiveNote = (updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId ? { ...note, ...updates } : note
    ));
  };

  const handleAddFolder = () => {
    const newFolder: ProjectFolder = {
      id: Date.now().toString(),
      name: 'New Project',
      isOpen: true,
    };
    setFolders([...folders, newFolder]);
    setRenamingId(newFolder.id);
    setRenameValue('New Project');
  };

  const handleAddPage = (folderId: string | null) => {
    const newNote: Note = {
      id: Date.now().toString(),
      folderId,
      icon: '📄',
      title: 'Untitled',
      content: '<p><br></p>',
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
    setRenamingId(newNote.id);
    setRenameValue('Untitled');
  };

  const toggleFolder = (folderId: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, isOpen: !f.isOpen } : f));
  };

  const contentRef = useRef<HTMLDivElement>(null);

  // Sync content only if it differs from ref to avoid cursor jumps
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== activeNote.content) {
      contentRef.current.innerHTML = activeNote.content;
    }
    setShowSketchpad(!!activeNote.doodleData);
  }, [activeNoteId]);

  const handleContentInput = () => {
    if (contentRef.current) {
      updateActiveNote({ content: contentRef.current.innerHTML });
    }
  };

  const execCmd = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      contentRef.current.focus();
      handleContentInput();
    }
  };

  // Special command to insert a code block
  const insertCodeBlock = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // Instead of formatBlock 'PRE', we will insert a structured HTML string
    // to ensure it renders exactly as a styled code block.
    const preNode = document.createElement('pre');
    preNode.innerHTML = '<code>Type your code here...</code>';
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(preNode);
    
    // Add a paragraph break after it so user can escape the code block easily
    const pNode = document.createElement('p');
    pNode.innerHTML = '<br>';
    preNode.parentNode?.insertBefore(pNode, preNode.nextSibling);

    if (contentRef.current) {
      contentRef.current.focus();
      handleContentInput();
    }
  };

  // --- Context Menu Actions ---
  const handleContextMenu = (e: React.MouseEvent, id: string, type: 'folder' | 'note') => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.pageX, y: e.pageY, id, type });
  };

  const handleAction = (action: 'rename' | 'delete' | 'duplicate') => {
    if (!contextMenu) return;
    const { id, type } = contextMenu;

    if (action === 'delete') {
      if (type === 'folder') {
        setFolders(prev => prev.filter(f => f.id !== id));
        setNotes(prev => prev.filter(n => n.folderId !== id)); // Cascade delete
      } else {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (activeNoteId === id) setActiveNoteId(notes[0]?.id || '');
      }
    } else if (action === 'rename') {
      setRenamingId(id);
      if (type === 'folder') {
        setRenameValue(folders.find(f => f.id === id)?.name || '');
      } else {
        setRenameValue(notes.find(n => n.id === id)?.title || '');
      }
    } else if (action === 'duplicate') {
      if (type === 'note') {
        const noteToDup = notes.find(n => n.id === id);
        if (noteToDup) {
          setNotes([...notes, { ...noteToDup, id: Date.now().toString(), title: `${noteToDup.title} (Copy)` }]);
        }
      }
    }
  };

  const commitRename = () => {
    if (!renamingId) return;
    setFolders(prev => prev.map(f => f.id === renamingId ? { ...f, name: renameValue || 'Untitled' } : f));
    setNotes(prev => prev.map(n => n.id === renamingId ? { ...n, title: renameValue || 'Untitled' } : n));
    setRenamingId(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-white overflow-hidden relative">
      
      {/* Context Menu Dropdown */}
      {contextMenu && (
        <div 
          className="fixed z-50 w-48 bg-white border border-black/[0.06] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => handleAction('rename')} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"><Edit2 className="w-3.5 h-3.5"/> Rename</button>
          {contextMenu.type === 'note' && <button onClick={() => handleAction('duplicate')} className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"><Copy className="w-3.5 h-3.5"/> Duplicate</button>}
          <div className="h-px w-full bg-black/[0.04] my-1" />
          <button onClick={() => handleAction('delete')} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5"/> Delete</button>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-[#FBFBFA] border-r border-black/[0.04] flex flex-col h-full z-10">
        <div className="h-14 flex items-center px-4 hover:bg-black/[0.03] cursor-pointer transition-colors border-b border-black/[0.04]">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-5 h-5 rounded-[0.3rem] bg-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-700">{workspaceInitial}</div>
            <span className="font-semibold text-sm text-zinc-800 truncate">{workspaceName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2">
          
          {/* Folders */}
          <div className="px-2 mb-2 flex items-center justify-between group">
            <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Projects</span>
            <button onClick={handleAddFolder} className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-zinc-200 transition-all text-zinc-500"><Plus className="w-3.5 h-3.5" /></button>
          </div>

          <div className="space-y-1 mb-6">
            {folders.map(folder => (
              <div key={folder.id}>
                <div 
                  className="flex items-center group relative"
                  onContextMenu={(e) => handleContextMenu(e, folder.id, 'folder')}
                >
                  {renamingId === folder.id ? (
                    <input 
                      autoFocus 
                      value={renameValue} 
                      onChange={(e) => setRenameValue(e.target.value)} 
                      onBlur={commitRename} 
                      onKeyDown={(e) => e.key === 'Enter' && commitRename()}
                      className="flex-1 ml-6 px-2 py-1 text-sm bg-white border border-blue-400 rounded-md outline-none" 
                    />
                  ) : (
                    <>
                      <button onClick={() => toggleFolder(folder.id)} className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-black/[0.04] text-zinc-600 text-sm font-medium transition-colors">
                        <ChevronRight className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${folder.isOpen ? 'rotate-90' : ''}`} />
                        {folder.isOpen ? <FolderOpen className="w-4 h-4 text-zinc-400" /> : <Folder className="w-4 h-4 text-zinc-400" />}
                        <span className="truncate">{folder.name}</span>
                      </button>
                      <button onClick={(e) => handleContextMenu(e, folder.id, 'folder')} className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded-sm hover:bg-zinc-200 transition-all text-zinc-400 absolute right-6"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleAddPage(folder.id)} className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded-sm hover:bg-zinc-200 transition-all text-zinc-500 absolute right-1"><Plus className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                </div>
                
                {/* Nested Pages */}
                {folder.isOpen && (
                  <div className="ml-5 mt-0.5 space-y-0.5 border-l border-black/[0.04] pl-2">
                    {notes.filter(n => n.folderId === folder.id).map(note => (
                      <div key={note.id} onContextMenu={(e) => handleContextMenu(e, note.id, 'note')} className="relative group">
                        {renamingId === note.id ? (
                          <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={commitRename} onKeyDown={(e) => e.key === 'Enter' && commitRename()} className="w-full px-2 py-1 text-sm bg-white border border-blue-400 rounded-md outline-none" />
                        ) : (
                          <button onClick={() => setActiveNoteId(note.id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${activeNoteId === note.id ? 'bg-black/[0.06] text-zinc-900' : 'text-zinc-500 hover:bg-black/[0.04] hover:text-zinc-700'}`}>
                            <span className="text-sm">{note.icon}</span>
                            <span className="truncate flex-1 text-left">{note.title || 'Untitled'}</span>
                          </button>
                        )}
                        {activeNoteId === note.id && renamingId !== note.id && <button onClick={(e) => handleContextMenu(e, note.id, 'note')} className="absolute right-2 top-1.5 p-0.5 rounded-sm hover:bg-zinc-200 text-zinc-500"><MoreHorizontal className="w-3.5 h-3.5"/></button>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Root Pages */}
          <div className="px-2 mb-2 flex items-center justify-between group">
            <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Private</span>
            <button onClick={() => handleAddPage(null)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-zinc-200 transition-all text-zinc-500"><Plus className="w-3.5 h-3.5" /></button>
          </div>
          
          <div className="space-y-0.5">
            {notes.filter(n => n.folderId === null).map(note => (
              <div key={note.id} onContextMenu={(e) => handleContextMenu(e, note.id, 'note')} className="relative group">
                {renamingId === note.id ? (
                  <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onBlur={commitRename} onKeyDown={(e) => e.key === 'Enter' && commitRename()} className="w-full px-2 py-1 text-sm bg-white border border-blue-400 rounded-md outline-none" />
                ) : (
                  <button onClick={() => setActiveNoteId(note.id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${activeNoteId === note.id ? 'bg-black/[0.06] text-zinc-900' : 'text-zinc-600 hover:bg-black/[0.04]'}`}>
                    <span className="text-base">{note.icon}</span>
                    <span className="truncate flex-1 text-left">{note.title || 'Untitled'}</span>
                  </button>
                )}
                {activeNoteId === note.id && renamingId !== note.id && <button onClick={(e) => handleContextMenu(e, note.id, 'note')} className="absolute right-2 top-1.5 p-0.5 rounded-sm hover:bg-zinc-200 text-zinc-500"><MoreHorizontal className="w-3.5 h-3.5"/></button>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        
        {/* Topbar */}
        <div className="h-12 flex items-center px-4 justify-between sticky top-0 z-20 bg-white">
          <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
            <BookOpen className="w-4 h-4" />
            <span className="hover:text-zinc-900 cursor-pointer transition-colors" onClick={() => { setActiveNoteId(notes[0].id) }}>Notes Vault</span>
            <ChevronRight className="w-3.5 h-3.5" />
            {activeNote.folderId && (
              <>
                <span className="hover:text-zinc-900 cursor-pointer transition-colors" onClick={() => { toggleFolder(activeNote.folderId as string); }}>
                  {folders.find(f => f.id === activeNote.folderId)?.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
            <span className="text-zinc-900 truncate max-w-[200px]">{activeNote.title || 'Untitled'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSketchpad(!showSketchpad)} className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${showSketchpad ? 'bg-blue-50 text-blue-600' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}>
              <PenTool className="w-4 h-4" /> Sketchpad
            </button>
            <div className="w-px h-4 bg-zinc-200 mx-1"></div>
            <button className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Rich Text Toolbar */}
        <div className="min-h-[40px] flex items-center flex-wrap px-6 py-1 gap-1 border-b border-black/[0.04] bg-white sticky top-12 z-20">
          
          {/* Font Selection */}
          <div className="relative group">
            <button className="flex items-center gap-1 p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 text-sm font-medium transition-colors">
              <Type className="w-4 h-4" /> Font <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-black/[0.06] shadow-lg rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
              <button onMouseDown={(e) => { e.preventDefault(); execCmd('fontName', 'Arial'); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-50 font-sans">Sans Serif</button>
              <button onMouseDown={(e) => { e.preventDefault(); execCmd('fontName', 'Georgia'); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-50 font-serif">Serif</button>
              <button onMouseDown={(e) => { e.preventDefault(); execCmd('fontName', 'Courier New'); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-50 font-mono">Monospace</button>
            </div>
          </div>
          
          {/* Text Color Selection */}
          <div className="relative group ml-1">
            <button className="flex items-center gap-1 p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 text-sm font-medium transition-colors">
              <Palette className="w-4 h-4" /> Color <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-black/[0.06] shadow-lg rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all flex gap-1">
              {['#18181b', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map(c => (
                <button key={c} onMouseDown={(e) => { e.preventDefault(); execCmd('foreColor', c); }} className="w-6 h-6 rounded-full border border-black/[0.04] hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="w-px h-4 bg-zinc-200 mx-2"></div>
          
          <button onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'H1'); }} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors" title="Heading 1"><Heading1 className="w-4 h-4" /></button>
          <button onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'H2'); }} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-zinc-200 mx-1"></div>
          <button onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors font-bold" title="Bold"><Bold className="w-4 h-4" /></button>
          <button onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors italic" title="Italic"><Italic className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-zinc-200 mx-1"></div>
          <button onMouseDown={insertCodeBlock} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors" title="Code Block"><Code className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-zinc-200 mx-1"></div>
          <button onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
          <button onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto px-8 md:px-24 py-12 prose-container relative">
          
          {/* Custom Styles for ContentEditable */}
          <style dangerouslySetInnerHTML={{__html: `
            .prose-container [contenteditable]:empty:before { content: attr(data-placeholder); color: #d4d4d8; cursor: text; }
            .prose-container h1 { font-size: 2.25rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.2; }
            .prose-container h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; }
            .prose-container p { margin-bottom: 0.75em; line-height: 1.6; }
            .prose-container ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
            .prose-container ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
            .prose-container b { font-weight: 600; }
            .prose-container i { font-style: italic; }
            .prose-container pre { background-color: #f4f4f5; padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.875rem; overflow-x: auto; margin-bottom: 1em; color: #27272a; border: 1px solid rgba(0,0,0,0.04); }
            .prose-container code { font-family: monospace; }
          `}} />

          
          <div className="max-w-[800px] mx-auto">
            
            {/* Cover Image Area */}
            {activeNote.coverUrl && (
              <div className="w-full h-48 sm:h-64 rounded-2xl mb-8 relative group overflow-hidden bg-zinc-100">
                <img src={activeNote.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <button 
                    onClick={() => updateActiveNote({ coverUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=1200&q=80` })} 
                    className="bg-white/90 backdrop-blur-sm text-zinc-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white shadow-sm"
                  >
                    Change cover
                  </button>
                  <button 
                    onClick={() => updateActiveNote({ coverUrl: undefined })}
                    className="bg-white/90 backdrop-blur-sm text-zinc-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Meta Actions */}
            {!activeNote.coverUrl && (
              <div className="flex items-center gap-4 text-zinc-400 font-medium text-sm mb-4 opacity-0 hover:opacity-100 transition-opacity duration-200 h-8">
                <button className="flex items-center gap-1.5 hover:bg-zinc-100 px-2 py-1 rounded-md transition-colors">
                  <Smile className="w-4 h-4" /> Add icon
                </button>
                <button 
                  onClick={() => updateActiveNote({ coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80' })}
                  className="flex items-center gap-1.5 hover:bg-zinc-100 px-2 py-1 rounded-md transition-colors"
                >
                  <ImageIcon className="w-4 h-4" /> Add cover
                </button>
              </div>
            )}

            {/* Icon Picker */}
            <div className="relative group/icon inline-block">
              <div className="text-6xl mb-4 cursor-pointer hover:bg-zinc-100 w-20 h-20 flex items-center justify-center rounded-xl transition-colors">
                {activeNote.icon}
              </div>
              
              <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-black/[0.06] shadow-xl rounded-xl opacity-0 group-hover/icon:opacity-100 invisible group-hover/icon:visible transition-all z-30 w-64 grid grid-cols-6 gap-1">
                {['📄', '🚀', '💻', '📝', '📌', '🔥', '✨', '💡', '🧠', '⚡️', '🌟', '🎯', '📚', '🛠️', '🎨', '📈', '✅', '🔒'].map(emoji => (
                  <button 
                    key={emoji} 
                    onClick={() => updateActiveNote({ icon: emoji })}
                    className="text-xl hover:bg-zinc-100 p-2 rounded-lg flex items-center justify-center transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateActiveNote({ title: e.target.value })}
              placeholder="Untitled"
              className="w-full text-4xl md:text-5xl font-bold text-zinc-900 placeholder:text-zinc-200 border-none outline-none bg-transparent mb-8 resize-none overflow-hidden"
            />

            {/* Sketchpad Injector */}
            {showSketchpad && (
              <DoodleCanvas 
                initialData={activeNote.doodleData} 
                onSave={(d) => updateActiveNote({ doodleData: d })} 
                onClose={() => setShowSketchpad(false)}
              />
            )}

            {/* Main Content Area (ContentEditable) */}
            <div
              ref={contentRef}
              className="w-full min-h-[500px] outline-none pb-32 text-zinc-800"
              contentEditable
              data-placeholder="Type '/' for commands, or start writing..."
              onInput={handleContentInput}
              onBlur={handleContentInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

