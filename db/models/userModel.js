let mongooseConnection;
let User;
let bcrypt = require('bcrypt');
let SALT_WORK_FACTOR = 10;
module.exports = injectedMongooseConnection => {

    mongooseConnection = injectedMongooseConnection;
    let Schema = mongooseConnection.Schema;
    let UserSchema = new Schema({
        username: String,
        password: String
    });

    UserSchema.pre('save', function(next){
        let user = this;
        if (!user.isModified('password')) return next();

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);

                user.password = hash;
                next();
            });
        });
    });

    User = mongooseConnection.model('User',UserSchema);
    return {
        user: User
    }
};

