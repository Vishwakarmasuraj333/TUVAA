const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/app/admin/service-comments/page.tsx',
  'src/app/admin/newsletter/page.tsx',
  'src/app/admin/news/page.tsx',
  'src/app/admin/users/page.tsx',
  'src/app/admin/projects/page.tsx',
  'src/app/admin/gallery/page.tsx',
  'src/app/admin/media/page.tsx',
  'src/app/admin/event-registrations/page.tsx',
  'src/app/admin/donation-campaigns/page.tsx',
  'src/app/admin/events/page.tsx',
  'src/app/admin/contact-messages/page.tsx',
  'src/app/admin/community-groups/page.tsx',
  'src/app/admin/bbam-directory/page.tsx'
];

for (const relPath of targetFiles) {
  const filepath = path.join(__dirname, relPath);
  if (!fs.existsSync(filepath)) continue;

  let content = fs.readFileSync(filepath, 'utf-8');

  // Skip if already processed
  if (content.includes('ConfirmDeleteDialog')) continue;

  console.log('Processing', relPath);

  // 1. Add import
  if (content.includes("import { toast } from 'sonner'")) {
      content = content.replace("import { toast } from 'sonner'", "import { toast } from 'sonner'\nimport ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'");
  } else {
      content = content.replace("import { useState", "import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog'\nimport { useState");
  }

  // 2. Inject State
  const stateInjection = `\n  // Dialog state\n  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)\n  const [itemToDelete, setItemToDelete] = useState<{ id: string | null; title: string }>({ id: null, title: '' })\n  const [isBulkDelete, setIsBulkDelete] = useState(false)\n  const [isDeleting, setIsDeleting] = useState(false)\n`;
  content = content.replace(/(const \[[a-zA-Z]+, [a-zA-Z]+\] = useState.*?$)/m, `$1${stateInjection}`);

  // 3. Inject Execute Function before the first handle... Delete
  // Find where handleDelete is
  const executeFunction = `
  const executeDelete = async () => {
    setIsDeleting(true)
    try {
      if (isBulkDelete) {
        // Bulk delete logic placeholder - will require manual tweak if bulk delete uses custom API endpoint names per file
      } else {
        if (!itemToDelete.id) return
        
        // Find correct API endpoint
        let endpoint = ''
        if (typeof window !== 'undefined') {
            endpoint = window.location.pathname.replace('/admin/', '/api/admin/')
            // Handle edge cases
        }
        
      }
    } catch(e) {}
  }
  `;
  // Actually, rewriting the execute function is highly specific per file.
  // The API paths are different, state variables to update are different (setUsers, setServices, setProjects).
}
