// src/components/RegisterForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser } from '../services/api';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required')
});

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Register</h2>

      <input {...register('name')} placeholder="Name" />
      <p>{errors.name?.message}</p>

      <input {...register('email')} type="email" placeholder="Email" />
      <p>{errors.email?.message}</p>

      <input {...register('password')} type="password" placeholder="Password" />
      <p>{errors.password?.message}</p>

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
