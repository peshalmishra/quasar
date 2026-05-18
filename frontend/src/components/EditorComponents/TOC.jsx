import { useEffect, useState } from 'react';
import { X, ArrowRightToLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TableOfContents = ({ editor }) => {
  const [headings, setHeadings] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!editor) return;

    const updateHeadings = () => {
      const nodes = [];
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          nodes.push({
            text: node.textContent,
            level: node.attrs.level,
            pos,
          });
        }
      });
      setHeadings(nodes);
    };

    updateHeadings();
    editor.on('update', updateHeadings);
    return () => editor.off('update', updateHeadings);
  }, [editor]);

  const scrollToHeading = (pos) => {
    editor?.commands.focus(pos);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="toc"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.4 }}
          >
            <button className="toc-close" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
            <ul>
              {headings.map((heading, idx) => (
                <li
                  key={idx}
                  className={`toc-item level-${heading.level}`}
                  onClick={() => scrollToHeading(heading.pos)}
                >
                  {heading.text}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          className="toc-toggle"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(true)}
        >
          <ArrowRightToLine />
        </motion.div>
      )}
    </>
  );
};

export default TableOfContents;
