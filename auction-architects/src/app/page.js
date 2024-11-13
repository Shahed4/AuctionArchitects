import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Welcome to AuctionArchitects</h1>
        <p>Your trusted marketplace for buying and selling cars</p>
        <button className={styles.exploreButton}>Explore Listings</button>
      </section>

      <section className={styles.catalog}>
        <h2>Browse by Category</h2>
        <div className={styles.categoryGrid}>
          <div className={styles.categoryItem}>SUVs</div>
          <div className={styles.categoryItem}>Sedans</div>
          <div className={styles.categoryItem}>Trucks</div>
          <div className={styles.categoryItem}>Electric</div>
        </div>
      </section>

      <section className={styles.featured}>
        <h2>Featured Listings</h2>
        <div className={styles.carGrid}>
          <div className={styles.carCard}>
            <img src="/images/car1.jpg" alt="Car 1" />
            <h3>2019 Toyota Camry</h3>
            <p>$20,000</p>
          </div>
          <div className={styles.carCard}>
            <img src="/images/car2.jpg" alt="Car 2" />
            <h3>2021 Tesla Model 3</h3>
            <p>$35,000</p>
          </div>
          {/* Add more car cards as needed */}
        </div>
      </section>
    </div>
  );
}
