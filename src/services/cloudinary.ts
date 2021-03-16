import axios from 'axios'
var qs = require('qs')

export async function upload(formData, fileType) {
  const { data } = await axios({
    url: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/${fileType}/upload`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: formData
  })
  return data
}

export async function deleteCloudinaryFile(fileType, publicId) {
  await axios({
    url: `https://${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}:${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}@api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/resources/${fileType}/upload`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      'public_ids[]': publicId
    })
  })
    .then(function (response) {
      console.log(JSON.stringify(response.data))
      return response.data
    })
    .catch(function (error) {
      console.log(error)
    })
}
