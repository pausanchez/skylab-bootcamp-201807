const logic = {
    set _userId(userId) {
        sessionStorage.setItem('userId', userId)
    },

    get _userId() {
        return sessionStorage.getItem('userId')
    },

    set _userToken(userToken) {
        sessionStorage.setItem('userToken', userToken)
    },

    get _userToken() {
        return sessionStorage.getItem('userToken')
    },

    set _userUsername(userUsername) {
        sessionStorage.setItem('userUsername', userUsername)
    },

    get userUsername() {
        return sessionStorage.getItem('userUsername')
    },

    set _userPassword(userPassword) {
        sessionStorage.setItem('userPassword', userPassword)
    },

    get _userPassword() {
        return sessionStorage.getItem('userPassword')
    },

    /*set _userFavorites(userFavorites) {
        sessionStorage.setItem('userFavorites', JSON.stringify(userFavorites))
    },

    get _userFavorites() {
        return JSON.parse(sessionStorage.getItem('userFavorites')) || []
    },

    galleryToken,*/

    _callUsersApi(path, method = 'get', body, useToken) {
        const config = {
            method
        }

        const methodNotGet = method !== 'get'

        if (methodNotGet || useToken) {
            config.headers = {}

            if (methodNotGet)
                config.headers['content-type'] = 'application/json'

            if (useToken)
                config.headers.authorization = 'Bearer ' + this._userToken
        }

        if (body)
            config.body = JSON.stringify(body)

        return fetch('https://skylabcoders.herokuapp.com/api' + path, config)
            .then(res => res.json())
            .then(res => {
                if (res.status === 'KO')
                    throw Error(res.error)

                return res;
            })
    },

   /* 
    _callGaleryApi(path) {
        return fetch('https://api.cloudinary.com/v1_1' + path, {
            headers: {
                authorization: 'Bearer ' + this.galleryToken
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error)
                    throw Error('request error, status ' + res.error.status);

                return res;
            });
    }, 
*/
    // user's

    registerUser(username, password) {
        return this._callUsersApi('/user', 'post', { username, password })
            .then(res => res.data.id)
    },

    loginUser(username, password) {
        return this._callUsersApi('/auth', 'post', { username, password })
            .then(({ data: { id, token } }) => {
                this._userId = id
                this._userToken = token
                this._userUsername = username
                this._userPassword = password // IDEAL encrypt it!

                // return true
                return this._callUsersApi(`/user/${this._userId}`, 'get', undefined, true)
            })
            .then(({ data }) => {
                //this._userFavorites = data.favorites || []

                return true
            })
    },

    logout() {
        this._userId = null
        this._userToken = null
        this._userUsername = null

        sessionStorage.clear()
    },

    get loggedIn() {
        return this._userId && this._userToken && this.userUsername
    },

    updateUser(password, newUsername, newPassword) {
        const data = {
            username: this.userUsername,
            password
        }

        if (newUsername)
            data.newUsername = newUsername

        if (newPassword)
            data.newPassword = newPassword

        return this._callUsersApi(`/user/${this._userId}`, 'put', data, true)
            .then(() => {
                if (newUsername)
                    this._userUsername = newUsername
                if(newPassword)
                    this._userPassword = newPassword

                return true
            })
    },

    unregisterUser(password) {
        return this._callUsersApi(`/user/${this._userId}`, 'delete', {
            username: this.userUsername,
            password
        }, true)
            .then(() => true)
    },
/*
    togglePhotoGallery(photoId) {
        const gallery = this._userGallery

        const index = favorites.indexOf(photoId)

        if (index > -1) {
            gallery.splice(index, 1)
        } else {
            favorites.push(photoId)
        }

        const data = {
            username: this.userUsername,
            password: this._userPassword,
            gallery
        }

        return this._callUsersApi(`/user/${this._userId}`, 'put', data, true)
            .then(() => {
                this._userGallery = gallery

                return true
            })
    },

    isGallery(photoId) {
        return this._userGallery.includes(photoId)
    }*/
};


//export default logic;
if (typeof module !== 'undefined')
    module.exports = logic;
