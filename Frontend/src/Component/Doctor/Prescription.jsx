import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import {sendPrescription} from "../../Services/doctorService/doctorService.js"

const PrescriptionModal = ({ isOpen, onClose, appointment, doctorId }) => {
    if (!appointment || !appointment.user) return null;
    
    const userID = appointment.user._id;
  


    const uniquePre = appointment.date+appointment.time;

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { prescriptions: [{ medicines: "", dosage: "", duration: "" }] }
  });
  const { fields, append, remove } = useFieldArray({ 
    control,
    name: "prescriptions"
  });

  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;
  
  const handleSend = async (data) => {

    const medicinesNames = data.prescriptions.map(prescriptions=>prescriptions.medicines.trim().toLowerCase());
    const uniqueMedicines = new Set(medicinesNames);
    if(medicinesNames.length !== uniqueMedicines.size)
    {
      toast.error('duplicate medicine detected')
    }
    

      const id = doctorId;

      const datas = data;
      await sendPrescription(doctorId, userID, datas,uniquePre);
    setIsSending(true);
    data.timeSent = new Date();
    
    setIsSending(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-xl mx-4 my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Send Prescription</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit(handleSend)}>
          <div className="mb-4">
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Diagnosis</label>
            <input
              id="diagnosis"
              {...register('diagnosis', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.diagnosis && <p className="mt-1 text-red-500 text-sm">This field is required!</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              {...register('description', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.description && <p className="mt-1 text-red-500 text-sm">This field is required!</p>}
          </div>

          {fields.map((item, index) => (
            <div key={item.id} className="mb-6 border rounded-md p-4">
              <div className="mb-4">
                <label htmlFor={`prescriptions[${index}].medicines`} className="block text-sm font-medium text-gray-700">Medicines</label>
                <input
                  id={`prescriptions[${index}].medicines`}
                  {...register(`prescriptions.${index}.medicines`, { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.prescriptions?.[index]?.medicines && <p className="mt-1 text-red-500 text-sm">This field is required!</p>}
              </div>
              <div className="mb-4">
                <label htmlFor={`prescriptions[${index}].dosage`} className="block text-sm font-medium text-gray-700">Dosage</label>
                <input
                  id={`prescriptions[${index}].dosage`}
                  {...register(`prescriptions.${index}.dosage`, { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.prescriptions?.[index]?.dosage && <p className="mt-1 text-red-500 text-sm">This field is required!</p>}
              </div>
              <div>
                <label htmlFor={`prescriptions[${index}].duration`} className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  id={`prescriptions[${index}].duration`}
                  type="number"
                  {...register(`prescriptions.${index}.duration`, { required: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.prescriptions?.[index]?.duration && <p className="mt-1 text-red-500 text-sm">This field is required!</p>}
              </div>
              {index !== 0 && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ medicines: "", dosage: "", duration: "" })}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add More
          </button>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;