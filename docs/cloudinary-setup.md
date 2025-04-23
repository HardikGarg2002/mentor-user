# Setting up Cloudinary for Image Uploads

This guide will walk you through setting up Cloudinary for handling image uploads in the application.

## How Image Storage Works

In our application:
1. Images are uploaded directly from the browser to Cloudinary
2. Cloudinary returns a secure URL for the uploaded image
3. This URL is stored in the **User** model in our database
4. The mentor profile retrieves the image URL from the associated user account

This approach keeps user data normalized and ensures the profile image is consistent across all parts of the application.

## Create a Cloudinary Account

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/users/register/free)
2. Once registered, navigate to your Dashboard to find your account details

## Configure Upload Presets

For secure, unsigned uploads directly from the browser, we need to create an upload preset:

1. In your Cloudinary Dashboard, go to **Settings > Upload**
2. Scroll down to **Upload presets** and click **Add upload preset**
3. Configure the preset:
   - **Preset name**: `mentor_avatars` (or your preferred name)
   - **Signing Mode**: Unsigned
   - **Folder**: `mentor_profiles` (optional, for organization)
   - **Allowed formats**: Set to your preferred image formats (e.g., jpg, png, webp)
   - **Maximum file size**: 5MB (recommended)
   - **Eager transformations**: You can add transformations like resizing if desired

## Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=mentor_avatars
```

Your cloud name can be found in your Cloudinary dashboard.

## Testing the Upload

1. After setting up, run your application
2. Navigate to your mentor profile
3. Click on the avatar edit button to upload an image
4. If successful, the image will be uploaded to Cloudinary and displayed in your profile

## Troubleshooting

If uploads aren't working:

1. Check the browser console for any errors
2. Verify your Cloudinary credentials in the environment variables
3. Ensure your upload preset is properly configured and set to "unsigned"
4. Make sure the file type and size meet the requirements set in your preset
5. Check network requests to see if the upload request is being sent correctly

## Additional Configuration Options

- **Image Transformations**: You can add automatic transformations like resizing, cropping, or quality adjustments
- **Asset Management**: Use Cloudinary's Media Library to manage uploaded images
- **Security**: Consider adding additional security measures for a production environment

For more information, refer to the [Cloudinary documentation](https://cloudinary.com/documentation). 