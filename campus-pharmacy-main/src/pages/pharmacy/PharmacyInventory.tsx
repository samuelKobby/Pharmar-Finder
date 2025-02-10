import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Package,
  Filter,
  RefreshCw,
  X,
  ChevronDown,
  Package2,
  FolderOpen,
  DollarSign,
  Hash,
  Box,
  Image as ImageIcon,
  Trash2 as TrashIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  unit: string;
  image?: string | File;
  imageUrl?: string;
}

interface NewMedicineFormProps {
  onSubmit: (medicine: Omit<Medicine, 'id'>) => void;
  onClose: () => void;
}

const NewMedicineForm: React.FC<NewMedicineFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'tablets',
    description: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      description: formData.description || '',
      image: formData.image || undefined
    });
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Medicine</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Medicine Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                placeholder="Enter medicine name"
              />
            </div>
          </div>

          {/* Category Input */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FolderOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                placeholder="Enter category"
              />
            </div>
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price Input */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="quantity"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Unit Input */}
          <div className="space-y-2">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Box className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="block w-full pl-10 pr-10 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400 appearance-none cursor-pointer"
              >
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="mg">Milligrams (mg)</option>
                <option value="pieces">Pieces</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                placeholder="Enter description"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Medicine Image
            </label>
            <div className="mt-1 flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
                >
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Click to upload image</span>
                </div>
              )}
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditMedicineModal: React.FC<{
  medicine: Medicine | null;
  onClose: () => void;
  onSave: (medicine: Medicine) => void;
}> = ({ medicine, onClose, onSave }) => {
  const [editedMedicine, setEditedMedicine] = useState<Medicine | null>(medicine);

  React.useEffect(() => {
    setEditedMedicine(medicine);
  }, [medicine]);

  if (!editedMedicine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedMedicine) {
      onSave(editedMedicine);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Edit Medicine</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Medicine Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                value={editedMedicine.name}
                onChange={(e) => setEditedMedicine({ ...editedMedicine, name: e.target.value })}
                className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                placeholder="Enter medicine name"
              />
            </div>
          </div>

          {/* Category Input */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FolderOpen className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="category"
                value={editedMedicine.category}
                onChange={(e) => setEditedMedicine({ ...editedMedicine, category: e.target.value })}
                className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                placeholder="Enter category"
              />
            </div>
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price Input */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  value={editedMedicine.price}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, price: parseFloat(e.target.value) })}
                  className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="quantity"
                  value={editedMedicine.quantity}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, quantity: parseInt(e.target.value) })}
                  className="block w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Unit Input */}
          <div className="space-y-2">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Box className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="unit"
                value={editedMedicine.unit}
                onChange={(e) => setEditedMedicine({ ...editedMedicine, unit: e.target.value })}
                className="block w-full pl-10 pr-10 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 placeholder-gray-400 sm:text-sm bg-white hover:border-gray-400 appearance-none cursor-pointer"
              >
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="mg">Milligrams (mg)</option>
                <option value="pieces">Pieces</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getMedicineImageUrl = (medicineId: string) => {
  const { data: imageUrl } = supabase.storage
    .from('medicine-images')
    .getPublicUrl(`${medicineId}.jpg`);
  return imageUrl.publicUrl;
};

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
};

export const PharmacyInventory: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [existingMedicines, setExistingMedicines] = useState<Medicine[]>([]);
  const [isAddingExisting, setIsAddingExisting] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    checkAuth();
    fetchMedicines();
    fetchAllMedicines();
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!session) {
      navigate('/pharmacy/login');
    }
  };

  const fetchMedicines = async () => {
    try {
      const pharmacyId = localStorage.getItem('pharmacyId');
      if (!pharmacyId) {
        toast.error('No pharmacy ID found');
        return;
      }

      const { data: medicinePharmacyData, error: relationError } = await supabase
        .from('medicine_pharmacies')
        .select('*')
        .eq('pharmacy_id', pharmacyId);

      if (relationError) {
        throw relationError;
      }

      const medicineIds = medicinePharmacyData.map(item => item.medicine_id);

      const { data: medicinesData, error: medicinesError } = await supabase
        .from('medicines')
        .select('*')
        .in('id', medicineIds);

      if (medicinesError) {
        throw medicinesError;
      }

      // Combine medicine data with quantities
      const medicinesWithQuantity = medicinesData.map(medicine => {
        const relationData = medicinePharmacyData.find(item => item.medicine_id === medicine.id);
        return {
          ...medicine,
          quantity: relationData?.quantity || 0,
          imageUrl: getMedicineImageUrl(medicine.id)
        };
      });

      setMedicines(medicinesWithQuantity);
    } catch (error: any) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available medicines
  const fetchAllMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      // Add image URLs to all medicines
      const medicinesWithImages = data?.map(medicine => ({
        ...medicine,
        imageUrl: getMedicineImageUrl(medicine.id)
      })) || [];

      setExistingMedicines(medicinesWithImages);
      setMedicines(medicinesWithImages);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(medicinesWithImages.map(m => m.category))];
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error('Error fetching all medicines:', error);
      toast.error('Failed to fetch available medicines');
    }
  };

  const handleAddMedicine = async (medicine: Omit<Medicine, 'id'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/pharmacy/login');
        return;
      }

      console.log('Current auth session:', session);
      console.log('User metadata:', session.user.user_metadata);
      console.log('Adding medicine:', medicine);

      const pharmacyId = localStorage.getItem('pharmacyId');
      console.log('Pharmacy ID from localStorage:', pharmacyId);
      
      if (!pharmacyId) {
        toast.error('No pharmacy ID found. Please login again.');
        return;
      }

      // First, add the medicine to the medicines table
      const { data: medicineData, error: medicineError } = await supabase
        .from('medicines')
        .insert([{
          name: medicine.name,
          category: medicine.category,
          price: medicine.price,
          unit: medicine.unit || 'tablets',
          description: medicine.description || ''
        }])
        .select()
        .single();

      console.log('Medicine insert response:', { data: medicineData, error: medicineError });

      if (medicineError) {
        console.error('Error inserting medicine:', medicineError);
        throw medicineError;
      }

      // Then create the association in medicine_pharmacies
      const associationData = {
        medicine_id: medicineData.id,
        pharmacy_id: pharmacyId,
        quantity: medicine.quantity || 0
      };
      console.log('Creating association with data:', associationData);

      const { error: associationError } = await supabase
        .from('medicine_pharmacies')
        .insert([associationData]);

      console.log('Association insert response:', { error: associationError });

      if (associationError) {
        console.error('Error creating association:', associationError);
        throw associationError;
      }

      if (medicine.image) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from('medicine-images')
          .upload(`${medicineData.id}.jpg`, medicine.image, {
            upsert: true
          });

        console.log('Image upload response:', { data: imageData, error: imageError });

        if (imageError) {
          console.error('Error uploading image:', imageError);
          throw imageError;
        }
      }

      toast.success('Medicine added successfully');
      fetchMedicines();
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Error adding medicine:', error);
      toast.error(error.message);
    }
  };

  const handleAddExistingMedicine = async (medicineId: string, quantity: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/pharmacy/login');
      }

      console.log('Adding existing medicine:', { medicineId, quantity });
      
      const pharmacyId = localStorage.getItem('pharmacyId');
      if (!pharmacyId) {
        toast.error('No pharmacy ID found. Please login again.');
        return;
      }

      // Check if the medicine is already in the pharmacy's inventory
      const { data: existingAssociation, error: checkError } = await supabase
        .from('medicine_pharmacies')
        .select('*')
        .eq('medicine_id', medicineId)
        .eq('pharmacy_id', pharmacyId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw checkError;
      }

      if (existingAssociation) {
        // Update existing association
        const { error: updateError } = await supabase
          .from('medicine_pharmacies')
          .update({ quantity })
          .eq('medicine_id', medicineId)
          .eq('pharmacy_id', pharmacyId);

        if (updateError) throw updateError;
        toast.success('Medicine quantity updated');
      } else {
        // Create new association
        const { error: associationError } = await supabase
          .from('medicine_pharmacies')
          .insert([{
            medicine_id: medicineId,
            pharmacy_id: pharmacyId,
            quantity
          }]);

        if (associationError) throw associationError;
        toast.success('Medicine added to inventory');
      }

      fetchMedicines();
      setShowAddModal(false);
      setIsAddingExisting(false);
    } catch (error: any) {
      console.error('Error adding existing medicine:', error);
      toast.error(error.message);
    }
  };

  const handleUpdateMedicine = async (medicine: Medicine) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/pharmacy/login');
      }

      const pharmacyId = localStorage.getItem('pharmacyId');
      if (!pharmacyId) {
        toast.error('No pharmacy ID found. Please login again.');
        return;
      }

      // Update medicine details
      const { error: medicineError } = await supabase
        .from('medicines')
        .update({
          name: medicine.name,
          category: medicine.category,
          price: medicine.price,
          unit: medicine.unit,
          description: medicine.description || ''
        })
        .eq('id', medicine.id);

      if (medicineError) {
        console.error('Error updating medicine:', medicineError);
        throw medicineError;
      }

      // Update quantity in medicine_pharmacies
      const { error: quantityError } = await supabase
        .from('medicine_pharmacies')
        .update({ quantity: medicine.quantity })
        .eq('medicine_id', medicine.id)
        .eq('pharmacy_id', pharmacyId);

      if (quantityError) {
        console.error('Error updating quantity:', quantityError);
        throw quantityError;
      }

      toast.success('Medicine updated successfully');
      fetchMedicines();
      setEditingMedicine(null);
    } catch (error: any) {
      console.error('Error updating medicine:', error);
      toast.error(error.message);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/pharmacy/login');
      }

      console.log('Current auth session:', session);
      console.log('Deleting medicine:', id);

      // Remove the association from medicine_pharmacies
      const { error: associationError } = await supabase
        .from('medicine_pharmacies')
        .delete()
        .eq('medicine_id', id)
        .eq('pharmacy_id', localStorage.getItem('pharmacyId'));

      console.log('Association delete response:', { error: associationError });

      if (associationError) {
        console.error('Error deleting association:', associationError);
        throw associationError;
      }

      toast.success('Medicine removed from inventory');
      fetchMedicines();
    } catch (error: any) {
      console.error('Error deleting medicine:', error);
      toast.error(error.message);
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = 
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'text-red-500', bg: 'bg-red-100', text: 'Out of Stock' };
    if (quantity < 10) return { color: 'text-yellow-500', bg: 'bg-yellow-100', text: 'Low Stock' };
    return { color: 'text-green-500', bg: 'bg-green-100', text: 'In Stock' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your pharmacy's medicine inventory
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsAddingExisting(false);
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Medicine
          </button>
          <button
            onClick={() => {
              setIsAddingExisting(true);
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Existing Medicine
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Medicines
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition duration-150 ease-in-out"
              placeholder="Type to search..."
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
              >
                <X className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm appearance-none cursor-pointer transition duration-150 ease-in-out"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="tablets">Tablets</option>
              <option value="syrups">Syrups</option>
              <option value="topical">Topical</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No medicines found
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((medicine) => {
                  const status = getStockStatus(medicine.quantity);
                  return (
                    <tr key={medicine.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <img
                                src={medicine.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
                                alt={medicine.name}
                                onError={handleImageError}
                                className="h-10 w-10 object-cover rounded-full"
                              />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {medicine.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {medicine.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {medicine.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      GH₵{medicine.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.bg} ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingMedicine(medicine)}
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-200"
                            title="Edit medicine"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(medicine.id)}
                            className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors duration-200"
                            title="Delete medicine"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {isAddingExisting ? 'Add Existing Medicine' : 'Add New Medicine'}
            </h2>
            
            {isAddingExisting ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const medicineId = (form.elements.namedItem('medicineId') as HTMLSelectElement).value;
                const quantity = parseInt((form.elements.namedItem('quantity') as HTMLInputElement).value);
                handleAddExistingMedicine(medicineId, quantity);
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="medicineId" className="block text-sm font-medium text-gray-700">
                      Medicine
                    </label>
                    <select
                      id="medicineId"
                      name="medicineId"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a medicine</option>
                      {existingMedicines.map((medicine) => (
                        <option key={medicine.id} value={medicine.id}>
                          {medicine.name} - {medicine.category} (₵{medicine.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="0"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add to Inventory
                  </button>
                </div>
              </form>
            ) : (
              <NewMedicineForm
                onSubmit={handleAddMedicine}
                onClose={() => setShowAddModal(false)}
              />
            )}
          </div>
        </div>
      )}
      {editingMedicine && (
        <EditMedicineModal
          medicine={editingMedicine}
          onClose={() => setEditingMedicine(null)}
          onSave={handleUpdateMedicine}
        />
      )}
    </div>
  );
};
