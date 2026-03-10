import LazyImage from './LazyImage';

const PersonCard = ({ person }) => {
  return (
    <div 
      className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Image Container */}
      <div className="aspect-[2/3] overflow-hidden">
        <LazyImage
          src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Photo'}
          alt={person.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 
          className="text-lg font-bold truncate group-hover:text-[var(--primary)] transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {person.name}
        </h3>
        <p 
          className="text-sm mt-1 truncate"
          style={{ color: 'var(--text-secondary)' }}
        >
          {person.known_for_department}
        </p>
        
        {/* Known For (Mini list) */}
        <div className="mt-3 flex flex-wrap gap-1">
          {person.known_for?.slice(0, 2).map((item) => (
            <span 
              key={item.id}
              className="text-[10px] px-2 py-0.5 rounded-full border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {item.title || item.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
