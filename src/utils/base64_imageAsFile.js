import * as FileSystem from 'expo-file-system'

const base64_imageAsFile = (img64, name) => {
    const path = FileSystem.cacheDirectory + `${name}.png`
    FileSystem.writeAsStringAsync(
        path,
        img64.replace('data:image/png;base64,', ''),
        { encoding: FileSystem.EncodingType.Base64 }
    )
        .then(() => FileSystem.getInfoAsync(path))
        .then((data) => {
            console.log(data)
        })
        .catch(console.error)
}

const DataURIToBlob = (dataURI) => {
    const splitDataURI = dataURI.split(',')
    const byteString =
        splitDataURI[0].indexOf('base64') >= 0
            ? atob(splitDataURI[1])
            : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
}

export { base64_imageAsFile, DataURIToBlob }
