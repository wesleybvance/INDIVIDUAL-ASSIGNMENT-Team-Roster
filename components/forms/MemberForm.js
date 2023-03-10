import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { createMember, updateMember } from '../../api/memberData';
import { useAuth } from '../../utils/context/authContext';
import { getMovies } from '../../api/movieData';

const initialStateMF = {
  first_name: '',
  last_name: '',
  image: '',
  role: '',
};

export default function MemberForm({ obj }) {
  const [formInput, setFormInput] = useState(initialStateMF);
  const [movies, setMovies] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    getMovies(user.uid).then(setMovies);

    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateMember(formInput)
        .then(() => router.push(`/team/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createMember(payload).then(({ name }) => {
        const patchPayloadFBK = { firebaseKey: name };
        updateMember(patchPayloadFBK).then(() => {
          router.push('/team');
        });
      });
    }
  };

  return (
    <div className="member-form-container">
      <Form onSubmit={handleSubmit}>
        <h2 className="member-form-text">{obj.firebaseKey ? 'Update' : 'Add New'} Crew Member</h2>
        <FloatingLabel
          controlId="floatingInput1"
          label="First Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Enter Member's First Name"
            name="first_name"
            value={formInput.first_name}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput1"
          label="Last Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Enter Member's Last Name"
            name="last_name"
            value={formInput.last_name}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingSelect" label="Movie">
          <Form.Select
            aria-label="Movie"
            name="movieid"
            onChange={handleChange}
            className="mb-3"
            value={formInput.movieid}
            required
          >
            <option value="">Select a Movie</option>
            {
            movies.map((movie) => (
              <option
                key={movie.firebaseKey}
                value={movie.firebaseKey}
              >
                {movie.title}
              </option>
            ))
          }
          </Form.Select>
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput1"
          label="Role"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Enter Member's Role"
            name="role"
            value={formInput.role}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingInput1"
          label="Member Image URL"
          className="mb-3"
        >
          <Form.Control
            type="url"
            placeholder="Enter Image URL"
            name="image"
            value={formInput.image}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <Button type="submit" variant="light">{obj.firebaseKey ? 'Update' : 'Create'}</Button>
      </Form>
    </div>
  );
}

MemberForm.propTypes = {
  obj: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    image: PropTypes.string,
    role: PropTypes.string,
    uid: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

MemberForm.defaultProps = {
  obj: initialStateMF,
};
