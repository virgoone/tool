import React, { useEffect } from 'react'
import { getUploadToken } from '@/service/upload'
import { setOptions, registerPlugin } from 'filepond'
import { FilePond } from 'react-filepond'
import axios from 'axios'
import md5 from 'crypto-js/md5'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import 'filepond/dist/filepond.min.css'
import './style.less'

const keyPrefix = `/upload/${Math.floor(Date.now() / 1000)}/`
const CancelToken = axios.CancelToken

interface UploadProps {
  keyPrefix: string
  uploadToken: string
}
type ActualFileObject = Blob & {
  readonly lastModified: number
  readonly name: string
}

type ProgressServerConfigFunction = (
  /**
   * Flag indicating if the resource has a length that can be calculated.
   * If not, the totalDataAmount has no significant value.  Setting this to
   * false switches the FilePond loading indicator to infinite mode.
   */
  isLengthComputable: boolean,
  /** The amount of data currently transferred. */
  loadedDataAmount: number,
  /** The total amount of data to be transferred. */
  totalDataAmount: number,
) => void

registerPlugin(FilePondPluginFileEncode)

function UploadPage(props: UploadProps) {
  useEffect(() => {
    setOptions({
      server: {
        process: (
          fieldName: string,
          file: ActualFileObject,
          metadata: { [key: string]: any },
          load: (p: string | { [key: string]: any }) => void,
          error: (errorText: string) => void,
          progress: ProgressServerConfigFunction,
          abort: () => void,
        ) => {
          const source = CancelToken.source()
          const uri = 'https://up.qiniup.com'
          const saveKey = `${props.keyPrefix}/${md5(file)}`
          const formData = new FormData()
          formData.append('file', file)
          formData.append('key', saveKey)
          formData.append('token', props.uploadToken)
          console.log('metadata--->', fieldName, metadata)

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },

            onUploadProgress: (progressEvent: any) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              )
              progress(
                !!percentCompleted,
                progressEvent.loaded,
                progressEvent.total,
              )
            },
            validateStatus: (status: number) => {
              return status >= 200 && status < 300 // default
            },
            cancelToken: source.token,
          }

          axios
            .post(uri, formData, config)
            .then(({ data }) => {
              console.log(data)
              load({ serverId: data.key })
            })
            .catch((axiosError) => {
              console.log('axiosError--->', axiosError)
              error('oh no')
            })

          return {
            abort: () => {
              // This function is entered if the user has tapped the cancel button
              source.cancel('Operation canceled by the user.')
              // Let FilePond know the request has been cancelled
              abort()
            },
          }
        },
      },
    })
  }, [])

  return (
    <div className="upload-page">
      <FilePond
        allowMultiple={true}
        allowDrop
        dropOnPage
        dropOnElement={false}
      />
    </div>
  )
}

UploadPage.getInitialProps = () => {
  return getUploadToken(encodeURIComponent(keyPrefix))
}

export default UploadPage
