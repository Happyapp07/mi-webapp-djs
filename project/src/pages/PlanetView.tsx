import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, Disc, Calendar, ChevronRight, Star, User } from 'lucide-react';
import { useGalaxyStore } from '../stores/galaxyStore';
import { useDJStore } from '../stores/djStore';
import { useAuthStore } from '../stores/authStore';
import { DJProfile } from '../types';

const PlanetView: React.FC = () => {
  const { galaxyId, planetId } = useParams<{ galaxyId: string; planetId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { galaxies, selectPlanet, selectedPlanet, selectedGalaxy } = useGalaxyStore();
  const { djRankings, fetchDJs, isLoading } = useDJStore();
  const [planetDJs, setPlanetDJs] = useState<DJProfile[]>([]);
  
  useEffect(() => {
    if (planetId) {
      selectPlanet(planetId);
      // Redirect to rankings with country filter
    }
  }
  )
}
export default PlanetView;