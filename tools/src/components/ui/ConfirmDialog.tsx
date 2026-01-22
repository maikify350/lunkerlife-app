import { FC } from 'react'
import Button from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '🗑️',
          confirmClass: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'warning':
        return {
          icon: '⚠️',
          confirmClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
      case 'info':
      default:
        return {
          icon: 'ℹ️',
          confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    }
  }

  const styles = getTypeStyles()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md mx-4 p-6">
        <div className="flex items-start mb-4">
          <span className="text-2xl mr-3">{styles.icon}</span>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={styles.confirmClass}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog