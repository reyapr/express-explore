const organization = require('../../service/organization/index');
const organizationService = require('../../service/organization/index');

module.exports = {
  create: (req, res, next) => {
    return organizationService.create(req.body.name)
      .then(organization => {
        res.status(200).json({
          message: 'success to create organization',
          data: organization
        })
      })
      .catch(err => next(err))
  },
  getByName: (req, res, next) => {
    return organizationService.getByName(req.params.name)
    .then(organization => {
      res.status(200).json({
        message: 'success to get organization',
        data: organization
      })
    })
    .catch(err => next(err)) 
  },
  deleteByName: (req, res, next) => {
    return organizationService.delete(req.params.name)
    .then(() => {
      res.status(200).json({
        message: 'success to delete organization',
      })
    })
    .catch(err => next(err)) 
  }
}