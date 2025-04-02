import Department from '../../Model/departmentModel.js';
import STATUS_CODE from '../../StatusCode/StatusCode.js';
export const addDepartment = async (req, res) => {
    try {
        const { Departmentname,Description } = req.body;
        
        
        const department = await Department.findOne({
            Departmentname: { $regex: new RegExp(`^${Departmentname}$`, 'i') }
        });
        
        if (department) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Department already exists' });
        }
        
    
        const newDepartment = new Department({ 
            Departmentname,
            status: 'Listed',
            Description
        });
        
        await newDepartment.save();
        res.status(STATUS_CODE.CREATED).json({ message: 'Department created successfully' });
        
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const getDepartments = async (req, res) => 

{
    const {page,limit} = req.query;

    try {
         
        
        const page = +(req.query.page || 1);
        const limit = +(req.query.limit || 10);
        const skip = (page - 1) * limit;
         const departments = await Department.find().skip(skip).limit(limit);


         const totalpage = Math.ceil(await Department.countDocuments() / limit);

         const departmentWithIndex = departments.map((department, index) => ({
            ...department.toObject(),
            serialNumber: index + 1
          }));

        res.status(STATUS_CODE.OK).json({departments:departmentWithIndex,totalpage});
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const updateDepartment = async (req, res) => {
       const {id} = req.params;



    try {
        
        const department = await Department.findById(id);
        if (!department) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Department not found' });
        }
        if(department.status === 'Listed'){
            department.status = 'Unlisted';
        }else{
            department.status = 'Listed';
        }
        await department.save();
        res.status(STATUS_CODE.OK).json({ message: 'Department status updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}