export const handleBannerImageUpload = async (
  imageFile: File,
  token: string
) => {
  try {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('token', token)
    const res = await fetch(`/api/media`, {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      const { data } = await res.json()
      return data
    }
    // appState?.setBannerImgId(data.id)
    // appState?.setBannerImgUrl(data.url)
  } catch (e) {
    console.error('Something went wrong!', e)
  }
}
