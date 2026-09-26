import React, { useState, useRef } from "react";
import {
  X,
  Plus,
  Upload,
  FileText,
  Image,
  Video,
  File,
  CheckCircle2,
  Trash2,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function AddSubjectModal({ isOpen, onClose, onAddCustomSubject }) {
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#a855f7");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const colorPalette = [
    "#a855f7", // Purple
    "#38bdf8", // Sky Blue
    "#10b981", // Emerald Green
    "#f59e0b", // Amber Orange
    "#ec4899", // Rose Pink
    "#6366f1", // Indigo
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (!files.length) return;
    const newFiles = files.map((file) => {
      let fileType = "doc";
      if (file.type.includes("pdf")) fileType = "pdf";
      else if (file.type.includes("image")) fileType = "image";
      else if (file.type.includes("video")) fileType = "video";

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        type: fileType,
        size: `${sizeInMB} MB`,
        rawFile: file,
      };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const handleRemoveFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setError("Please provide a subject name.");
      return;
    }

    const newSubject = {
      id: `custom-${Date.now()}`,
      name: subjectName.trim(),
      desc: description.trim() || `Custom student curriculum with ${uploadedFiles.length} uploaded reference notes.`,
      color: selectedColor,
      is_custom: true,
      media: uploadedFiles,
      topics: [
        "Uploaded Reference Notes",
        "Conceptual Foundations",
        "AI Diagnostic Practice",
        "Active Knowledge Retrieval",
      ],
      createdAt: new Date().toISOString(),
    };

    if (onAddCustomSubject) {
      onAddCustomSubject(newSubject);
    }

    // Reset and close
    setSubjectName("");
    setDescription("");
    setUploadedFiles([]);
    setError("");
    onClose();
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText size={18} className="text-danger" />;
      case "image":
        return <Image size={18} className="text-accent" />;
      case "video":
        return <Video size={18} className="text-warning" />;
      default:
        return <File size={18} className="text-muted" />;
    }
  };

  return (
    <div className="auth-overlay futuristic-overlay" onClick={onClose}>
      <div className="auth-modal futuristic-card add-subject-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="futuristic-top-glow" />

        <button className="auth-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="firebase-status-banner">
            <Sparkles size={13} className="radio-pulse" />
            <span>CUSTOM CURRICULUM ENGINE ACTIVE</span>
          </div>

          <h2>+ Add Custom Subject</h2>
          <p>
            Create an arbitrary subject. Upload class notes, PDF syllabi, or textbook diagrams to dynamically
            generate AI diagnostics and personalized learning paths.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form add-subject-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label>Subject Name *</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Robotics, Psychology, French Language, World History..."
              className="auth-input-clean"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Short Description & Focus Goals (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Microcontroller programming, sensors, kinematics and board exam topics"
              className="auth-input-clean"
            />
          </div>

          <div className="form-group">
            <label>Subject Accent Color Theme</label>
            <div className="color-palette-row">
              {colorPalette.map((col) => (
                <button
                  key={col}
                  type="button"
                  className={`color-circle-btn ${selectedColor === col ? "active" : ""}`}
                  style={{ background: col }}
                  onClick={() => setSelectedColor(col)}
                >
                  {selectedColor === col && <CheckCircle2 size={14} color="#fff" />}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Media Section */}
          <div className="form-group">
            <label>Upload Study Material / Reference Media (PDF, Images, Video, Docs)</label>
            <div
              className={`dropzone-area ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.mp4,.txt"
                style={{ display: "none" }}
              />
              <Upload size={28} className="dropzone-icon" />
              <p>
                <b>Click to upload</b> or drag & drop notes, slides, or syllabus
              </p>
              <small>Supported formats: PDF, DOC, Images (PNG/JPG), MP4, TXT up to 50MB</small>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files-preview-list">
                <span className="files-count-badge">
                  📎 {uploadedFiles.length} Reference Material(s) Attached:
                </span>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="uploaded-file-chip flex-between">
                    <div className="file-info-group">
                      {getFileIcon(file.type)}
                      <span className="file-name-text">{file.name}</span>
                      <small className="file-size-tag">({file.size})</small>
                    </div>
                    <button
                      type="button"
                      className="file-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(file.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="onboarding-action-row flex-between">
            <button type="button" className="outline-btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <Plus size={16} />
              <span>Save & Add to My Curriculum</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
