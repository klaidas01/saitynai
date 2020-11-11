import { React } from 'react';
import BookForm from './BookForm';
import axiosInstance from './../../../services/axiosInstance';

const NewBook = () => {
  const onSumbit = (values) => {
    const uploadItem = async () => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('author', values.author);
      formData.append('pageCount', values.pageCount);
      formData.append('description', values.description);
      formData.append('libraryId', values.libraryId);
      formData.append('coverImage', values.coverImage ? values.coverImage : null);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      try {
        await axiosInstance.post('books', formData, config);
      } catch (e) {
        console.log(e);
      }
    };
    uploadItem();
  };

  return <BookForm onSubmit={onSumbit} />;
};

export default NewBook;
