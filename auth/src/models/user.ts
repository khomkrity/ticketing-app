import mongoose from 'mongoose';

// an interface describing properties required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

// create new user (with attribute checking)
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

export { User, buildUser };
