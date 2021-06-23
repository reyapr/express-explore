const { BusinessLogicException } = require('../../libraries/exception');
const Organization = require('../../models/organization');


module.exports = {
  create: name => {
    return Organization.create({ name })
  },
  getByName: name => {
    return Organization.findOne({where: { name, isDeleted: false }})
      .then(organization => {
        if(organization) {
          return organization;
        }
        
        throw new BusinessLogicException({
          status: 400,
          message: 'Data not exist'
        })
      })
  },
  delete: name => {
    return Organization.update({ isDeleted: true }, 
      {
        where: {
          name: name,
          isDeleted: false
        }
      })
      .then(organization => {
        if(organization[0] === 1) {
          return organization;
        }
        
        throw new BusinessLogicException({
          status: 400,
          message: 'Data not exist'
        })
      });
  }
}