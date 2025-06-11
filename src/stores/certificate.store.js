import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePromise } from '@/composables';
import { mapCertificateFromAPI } from '@/mappers/certificate/certificate.mapper';
import {
  getCertificates as getCertificatesAPI,
  createCertificate as createCertificateAPI,
  updateCertificate as updateCertificateAPI,
  deleteCertificate as deleteCertificateAPI,
} from '@/services/api/certificate.service';

export const certificateStore = defineStore('certificate', () => {
  const certificates = ref([]);

  // Get Certificates
  const { execute: fetchCertificates, loading: certificatesLoading } = usePromise(async () => {
    const { data } = await getCertificatesAPI();
    certificates.value = data.map(mapCertificateFromAPI);
    return data;
  });

  // Create Certificate
  const { execute: createCertificate, loading: createLoading } = usePromise(
    async (certificateData) => {
      const { data } = await createCertificateAPI(certificateData);
      const mappedData = mapCertificateFromAPI(data);
      certificates.value.push(mappedData);
      return mappedData;
    },
  );

  // Update Certificate
  const { execute: updateCertificate, loading: updateLoading } = usePromise(
    async (id, certificateData) => {
      const { data } = await updateCertificateAPI(id, certificateData);
      const mappedData = mapCertificateFromAPI(data);
      const index = certificates.value.findIndex((cert) => cert.id === id);
      if (index !== -1) {
        certificates.value[index] = mappedData;
      }
      return mappedData;
    },
  );

  // Delete Certificate
  const { execute: deleteCertificate, loading: deleteLoading } = usePromise(async (id) => {
    await deleteCertificateAPI(id);
    const index = certificates.value.findIndex((cert) => cert.id === id);
    if (index !== -1) {
      certificates.value.splice(index, 1);
    }
  });

  return {
    certificates,
    certificatesLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    fetchCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  };
});
