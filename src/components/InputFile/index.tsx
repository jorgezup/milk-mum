import { useRef } from 'react'
import styles from './styles.module.scss'

export function InputFile({onFileSelectSuccess, onFileSelectError}) {
  const fileInput = useRef(null)

  const handleFileInput = (event) => {
    const file = event.target.files[0]

    const fileSizeMB = file.size/1024/1024

    if (fileSizeMB > 5) {
      onFileSelectError({
        error: "Arquivo maior que 5MB"
      })
    } else {
      onFileSelectSuccess(file)
    }
  }

  return (
    <div className={styles.fileUploader}>
      <input type="file" onChange={handleFileInput}/>
      <button 
        onClick={event => fileInput.current && fileInput.current.click()}
        className="button-primary"></button>
    </div>
  )
}

